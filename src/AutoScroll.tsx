import classnames from 'classnames';
import React from 'react';

interface Props {
  /**
   * ID attribute of the checkbox. Used to associate the input and label elements.
   */
  checkBoxId?: string;

  /**
   * React elements to render inside the scrollable container.
   */
  children: React.ReactNode;

  /**
   * Additional CSS class names to apply to the root container.
   */
  className?: string;

  /**
   * Fixed height (in pixels) of the scrollable container.
   */
  height?: number;

  /**
   * Label text displayed next to the auto-scroll checkbox option.
   */
  optionText?: string;

  /**
   * If true, disables all mouse and pointer interaction with the scroll container.
   */
  preventInteraction?: boolean;

  /**
   * Defines how scrolling should behave — either instant (`'auto'`) or animated (`'smooth'`).
   */
  scrollBehavior?: 'smooth' | 'auto';

  /**
   * If true, shows the "Auto scroll" checkbox option below the container.
   * If false, the parent component must control the auto-scroll behavior via props.
   */
  showOption?: boolean;

  /**
   * Current value indicating whether auto-scrolling is enabled.
   *
   * - **When `showOption` is `true`**: this prop is optional, as internal state is used.
   * - **When `showOption` is `false`**: this prop becomes **required**, since the parent must
   *   fully control the scroll behavior (controlled mode).
   */
  autoScroll?: boolean;

  /**
   * Setter function to update the `autoScroll` state.
   *
   * - **When `showOption` is `true`**: optional; internal state management is used.
   * - **When `showOption` is `false`**: required; used by the component to notify the parent
   *   when auto-scroll should toggle (e.g., when the user manually scrolls up).
   */
  setAutoScroll?: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Base CSS class.
 * @private
 */
const baseClass = 'react-auto-scroll';

/**
 * Get a random string.
 * @private
 */
const getRandomString = () =>
  Math.random()
    .toString(36)
    .slice(2, 15);

/**
 * AutoScroll component renders a scrollable container that automatically scrolls to the bottom
 * when new content is added.
 *
 * It can work in two modes:
 *
 * 1. **Uncontrolled (default)**: Internal state manages auto-scroll. A checkbox UI lets
 *    users toggle auto-scrolling.
 * 2. **Controlled**: When `showOption` is `false`, the parent component provides `autoScroll`
 *    and `setAutoScroll` props to manage behavior externally.
 */
export default function AutoScroll({
  checkBoxId = getRandomString(),
  children,
  className,
  height,
  optionText = 'Auto scroll',
  preventInteraction = false,
  scrollBehavior = 'smooth',
  showOption = true,
  autoScroll: parentAutoScroll,
  setAutoScroll: parentSetAutoScroll,
}: Props) {
  const isControlled =
    typeof parentAutoScroll === 'boolean' && typeof parentSetAutoScroll === 'function';

  const [autoScroll, setAutoScroll] = React.useState(true);
  const effectiveAutoScroll = isControlled ? (parentAutoScroll as boolean) : autoScroll;
  const setEffectiveAutoScroll = isControlled
    ? (parentSetAutoScroll as React.Dispatch<React.SetStateAction<boolean>>)
    : setAutoScroll;

  const containerElement = React.useRef<HTMLDivElement>(null);
  const cls = classnames(baseClass, className, {
    [`${baseClass}--empty`]: React.Children.count(children) === 0,
    [`${baseClass}--prevent-interaction`]: preventInteraction,
    [`${baseClass}--showOption`]: showOption,
  });
  const style = {
    height,
    overflow: 'auto',
    scrollBehavior: 'auto',
    pointerEvents: preventInteraction ? 'none' : 'auto',
  } as const;

  // Handle mousewheel events on the scroll container.
  const onWheel = () => {
    const { current } = containerElement;

    if (current && (showOption || isControlled)) {
      setEffectiveAutoScroll(current.scrollTop + current.offsetHeight === current.scrollHeight);
    }
  };

  // Apply the scroll behavior property after the first render,
  // so that the initial render is scrolled all the way to the bottom.
  React.useEffect(() => {
    setTimeout(() => {
      const { current } = containerElement;

      if (current) {
        current.style.scrollBehavior = scrollBehavior;
      }
    }, 0);
  }, [containerElement, scrollBehavior]);

  // When the children are updated, scroll the container
  // to the bottom.
  React.useEffect(() => {
    if (!effectiveAutoScroll) {
      return;
    }

    const { current } = containerElement;

    if (current) {
      current.scrollTop = current.scrollHeight;
    }
  }, [children, containerElement, effectiveAutoScroll]);

  return (
    <div className={cls}>
      <div
        className={`${baseClass}__scroll-container`}
        onWheel={onWheel}
        ref={containerElement}
        style={style}
      >
        {children}
      </div>

      {showOption && !preventInteraction && (
        <div className={`${baseClass}__option`}>
          <input
            checked={effectiveAutoScroll}
            className={`${baseClass}__option-input`}
            id={`${baseClass}__option-input-${checkBoxId}`}
            onChange={() => setEffectiveAutoScroll(!effectiveAutoScroll)}
            type="checkbox"
          />

          <label
            className={`${baseClass}__option-text`}
            htmlFor={`${baseClass}__option-input-${checkBoxId}`}
          >
            {optionText}
          </label>
        </div>
      )}
    </div>
  );
}
