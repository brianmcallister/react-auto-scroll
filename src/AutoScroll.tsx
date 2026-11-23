import {
  Children,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type TouchEvent,
  type WheelEvent,
} from 'react';

export interface AutoScrollProps {
  /** ID for the auto scroll checkbox. Defaults to a generated ID. */
  checkBoxId?: string;
  /** Content to render in the scroll container. */
  children?: ReactNode;
  /** Extra CSS class names. */
  className?: string;
  /** Height of the scroll container, in pixels. */
  height?: number;
  /** Label for the auto scroll checkbox. */
  optionText?: string;
  /** Prevent all mouse interaction with the scroll container. */
  preventInteraction?: boolean;
  /** How to scroll to new content. The first scroll to the bottom is always instant. */
  scrollBehavior?: 'smooth' | 'auto';
  /**
   * Show the auto scroll checkbox. With it shown, scrolling up pauses auto scrolling, and
   * scrolling back to the bottom resumes it.
   */
  showOption?: boolean;
}

const BASE_CLASS = 'react-auto-scroll';

/** How close to the bottom, in pixels, still counts as the bottom. Allows for subpixel sizes. */
const BOTTOM_TOLERANCE = 2;

// useLayoutEffect avoids a flash of unscrolled content, but React warns about it on the server.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Keys that scroll a container up. */
const SCROLL_UP_KEYS = new Set(['ArrowUp', 'Home', 'PageUp']);

/** Roughly how far the arrow keys and line-based wheel events scroll, in pixels. */
const LINE_HEIGHT = 40;

const distanceFromBottom = (element: HTMLElement) =>
  element.scrollHeight - element.scrollTop - element.clientHeight;

const isAtBottom = (element: HTMLElement) => distanceFromBottom(element) <= BOTTOM_TOLERANCE;

/**
 * A scroll container that keeps itself scrolled to the bottom as its content changes.
 */
export const AutoScroll = ({
  checkBoxId,
  children,
  className,
  height,
  optionText = 'Auto scroll',
  preventInteraction = false,
  scrollBehavior = 'smooth',
  showOption = true,
}: AutoScrollProps) => {
  const generatedId = useId();
  const inputId = `${BASE_CLASS}__option-input-${checkBoxId ?? generatedId}`;
  const [autoScroll, setAutoScroll] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);
  const lastScrollTopRef = useRef(0);
  const touchYRef = useRef<number | null>(null);

  const scrollToBottom = useCallback(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: hasScrolledRef.current ? scrollBehavior : 'auto',
    });
    hasScrolledRef.current = true;
  }, [scrollBehavior]);

  // Scroll to the bottom when the content changes, and when auto scrolling is turned back on.
  useIsomorphicLayoutEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [children, autoScroll, scrollToBottom]);

  // Also scroll when the content changes without this component rendering again.
  useEffect(() => {
    const container = containerRef.current;

    if (!container || !autoScroll || typeof MutationObserver === 'undefined') {
      return undefined;
    }

    const observer = new MutationObserver(scrollToBottom);
    observer.observe(container, { characterData: true, childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [autoScroll, scrollToBottom]);

  // Pause as soon as the person starts scrolling up. Browsers animate wheel, keyboard and touch
  // scrolling, and scrolling to new content would cancel that animation before it moved anything,
  // so waiting for the scroll event isn't enough when content arrives quickly.
  const pause = () => {
    const container = containerRef.current;

    if (showOption && container && container.scrollTop > 0) {
      setAutoScroll(false);
    }
  };

  // Resume as soon as the person scrolls down far enough to reach the bottom. Waiting for the scroll
  // event has the same problem: new content moves the bottom before the animation gets there.
  const resumeIfReachingBottom = (distance: number) => {
    const container = containerRef.current;

    if (showOption && container && distanceFromBottom(container) - distance <= BOTTOM_TOLERANCE) {
      setAutoScroll(true);
    }
  };

  const onWheel = (event: WheelEvent) => {
    if (event.deltaY < 0) {
      pause();
    } else if (event.deltaY > 0) {
      const container = containerRef.current;
      // deltaMode 1 is lines and 2 is pages. The default, 0, is pixels.
      const unit =
        event.deltaMode === 1
          ? LINE_HEIGHT
          : event.deltaMode === 2
            ? (container?.clientHeight ?? 0)
            : 1;

      resumeIfReachingBottom(event.deltaY * unit);
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (SCROLL_UP_KEYS.has(event.key)) {
      pause();
    } else if (event.key === 'End') {
      resumeIfReachingBottom(Infinity);
    } else if (event.key === 'PageDown') {
      resumeIfReachingBottom(containerRef.current?.clientHeight ?? 0);
    } else if (event.key === 'ArrowDown') {
      resumeIfReachingBottom(LINE_HEIGHT);
    }
  };

  const onTouchStart = (event: TouchEvent) => {
    touchYRef.current = event.touches[0]?.clientY ?? null;
  };

  const onTouchMove = (event: TouchEvent) => {
    const y = event.touches[0]?.clientY;

    // Dragging a finger down scrolls the content up.
    if (y !== undefined && touchYRef.current !== null && y > touchYRef.current) {
      pause();
    }

    touchYRef.current = y ?? null;
  };

  const onScroll = () => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const scrolledUp = container.scrollTop < lastScrollTopRef.current;
    lastScrollTopRef.current = container.scrollTop;

    if (!showOption) {
      return;
    }

    // This catches scrolling up with the scrollbar. Scrolling to new content only ever moves down,
    // so scrolling up means the person did it. When content is removed, the browser keeps the
    // container at the bottom, so check that first.
    if (isAtBottom(container)) {
      setAutoScroll(true);
    } else if (scrolledUp) {
      setAutoScroll(false);
    }
  };

  const classes = [
    BASE_CLASS,
    className,
    Children.count(children) === 0 && `${BASE_CLASS}--empty`,
    preventInteraction && `${BASE_CLASS}--prevent-interaction`,
    showOption && `${BASE_CLASS}--showOption`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <div
        className={`${BASE_CLASS}__scroll-container`}
        onKeyDown={onKeyDown}
        onScroll={onScroll}
        onTouchMove={onTouchMove}
        onTouchStart={onTouchStart}
        onWheel={onWheel}
        ref={containerRef}
        style={{
          height,
          overflow: 'auto',
          pointerEvents: preventInteraction ? 'none' : 'auto',
        }}
      >
        {children}
      </div>

      {showOption && !preventInteraction && (
        <div className={`${BASE_CLASS}__option`}>
          <input
            checked={autoScroll}
            className={`${BASE_CLASS}__option-input`}
            id={inputId}
            onChange={() => {
              setAutoScroll(!autoScroll);
            }}
            type="checkbox"
          />

          <label className={`${BASE_CLASS}__option-text`} htmlFor={inputId}>
            {optionText}
          </label>
        </div>
      )}
    </div>
  );
};
