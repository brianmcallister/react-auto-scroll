import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import AutoScrollDefault, { AutoScroll } from '../index';

const scrollTo = vi.fn<(this: HTMLElement, options: ScrollToOptions) => void>();

beforeEach(() => {
  scrollTo.mockReset();
  // jsdom doesn't implement scrolling, so scrolling just records the position.
  scrollTo.mockImplementation(function (this: HTMLElement, options) {
    this.scrollTop = options.top ?? 0;
  });
  Element.prototype.scrollTo = scrollTo as unknown as typeof Element.prototype.scrollTo;
});

afterEach(cleanup);

const getContainer = () => {
  const container = document.querySelector<HTMLElement>('.react-auto-scroll__scroll-container');

  if (!container) {
    throw new Error('No scroll container');
  }

  return container;
};

/** Give the container a size, since jsdom doesn't do layout. */
const setLayout = (element: HTMLElement, sizes: { scrollHeight: number; clientHeight: number }) => {
  Object.defineProperty(element, 'scrollHeight', { configurable: true, value: sizes.scrollHeight });
  Object.defineProperty(element, 'clientHeight', { configurable: true, value: sizes.clientHeight });
};

/** Scroll the container to `top`, like a person would. */
const scrollContainer = (element: HTMLElement, top: number) => {
  element.scrollTop = top;
  fireEvent.scroll(element);
};

const Messages = ({ count }: { count: number }) => (
  <>
    {Array.from({ length: count }, (_, index) => (
      <p key={index}>Message {index}</p>
    ))}
  </>
);

describe('AutoScroll', () => {
  it('is the default export', () => {
    expect(AutoScrollDefault).toBe(AutoScroll);
  });

  it('renders its children in the scroll container', () => {
    render(
      <AutoScroll>
        <Messages count={3} />
      </AutoScroll>,
    );

    expect(getContainer().textContent).toBe('Message 0Message 1Message 2');
  });

  it('adds classes for its state', () => {
    const { container, rerender } = render(<AutoScroll className="extra" />);
    const root = container.firstElementChild as HTMLElement;

    expect(root.className).toBe(
      'react-auto-scroll extra react-auto-scroll--empty react-auto-scroll--showOption',
    );

    rerender(
      <AutoScroll preventInteraction showOption={false}>
        <p>a</p>
      </AutoScroll>,
    );

    expect(root.className).toBe('react-auto-scroll react-auto-scroll--prevent-interaction');
  });

  it('sets the height of the scroll container', () => {
    render(<AutoScroll height={120} />);

    expect(getContainer().style.height).toBe('120px');
  });

  it('labels the checkbox with optionText', () => {
    render(<AutoScroll optionText="Follow along" />);

    expect(screen.getByLabelText('Follow along')).toHaveProperty('checked', true);
  });

  // Regression: the default checkbox id used to change on every render.
  it('keeps the same checkbox id across renders', () => {
    const { rerender } = render(<AutoScroll optionText="Follow" />);
    const id = screen.getByLabelText('Follow').id;

    rerender(
      <AutoScroll optionText="Follow">
        <p>new</p>
      </AutoScroll>,
    );

    expect(screen.getByLabelText('Follow').id).toBe(id);
  });

  it('uses checkBoxId for the checkbox id', () => {
    render(<AutoScroll checkBoxId="chat" />);

    expect(screen.getByRole('checkbox').id).toBe('react-auto-scroll__option-input-chat');
  });

  it('renders the same markup on the server', () => {
    expect(renderToString(<AutoScroll checkBoxId="x" height={50} />)).toContain(
      'id="react-auto-scroll__option-input-x"',
    );
  });

  it('scrolls to the bottom instantly at first, then with scrollBehavior', () => {
    const { rerender } = render(
      <AutoScroll>
        <Messages count={1} />
      </AutoScroll>,
    );

    expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ behavior: 'auto' }));

    setLayout(getContainer(), { scrollHeight: 500, clientHeight: 100 });
    rerender(
      <AutoScroll>
        <Messages count={2} />
      </AutoScroll>,
    );

    expect(scrollTo).toHaveBeenLastCalledWith({ top: 500, behavior: 'smooth' });
  });

  it('uses scrollBehavior auto when asked', () => {
    const { rerender } = render(
      <AutoScroll scrollBehavior="auto">
        <Messages count={1} />
      </AutoScroll>,
    );

    rerender(
      <AutoScroll scrollBehavior="auto">
        <Messages count={2} />
      </AutoScroll>,
    );

    expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ behavior: 'auto' }));
  });

  it('scrolls when the content changes without a render', async () => {
    render(
      <AutoScroll>
        <p id="live">first</p>
      </AutoScroll>,
    );
    scrollTo.mockClear();

    screen.getByText('first').textContent = 'second';
    await act(() => Promise.resolve());

    expect(scrollTo).toHaveBeenCalled();
  });

  // Regression: only the mouse wheel used to pause auto scrolling.
  it('pauses when scrolled up by any means, and resumes at the bottom', () => {
    const { rerender } = render(
      <AutoScroll optionText="Follow">
        <Messages count={10} />
      </AutoScroll>,
    );
    const container = getContainer();
    setLayout(container, { scrollHeight: 1000, clientHeight: 200 });
    scrollContainer(container, 800);

    scrollContainer(container, 300);
    expect(screen.getByLabelText('Follow')).toHaveProperty('checked', false);

    scrollTo.mockClear();
    rerender(
      <AutoScroll optionText="Follow">
        <Messages count={11} />
      </AutoScroll>,
    );
    expect(scrollTo).not.toHaveBeenCalled();

    // Regression: an exact comparison never matched at subpixel sizes.
    scrollContainer(container, 799.5);
    expect(screen.getByLabelText('Follow')).toHaveProperty('checked', true);
  });

  it('stays on when removed content moves the scroll position up', () => {
    render(
      <AutoScroll optionText="Follow">
        <Messages count={10} />
      </AutoScroll>,
    );
    const container = getContainer();
    setLayout(container, { scrollHeight: 1000, clientHeight: 200 });
    scrollContainer(container, 800);

    // The browser keeps the container at the bottom as it gets shorter.
    setLayout(container, { scrollHeight: 900, clientHeight: 200 });
    scrollContainer(container, 700);

    expect(screen.getByLabelText('Follow')).toHaveProperty('checked', true);
  });

  it('scrolls to the bottom when the checkbox is turned back on', () => {
    render(<AutoScroll optionText="Follow" />);
    const checkbox = screen.getByLabelText('Follow');

    fireEvent.click(checkbox);
    scrollTo.mockClear();
    fireEvent.click(checkbox);

    expect(scrollTo).toHaveBeenCalledTimes(1);
  });

  it('keeps scrolling when the option is hidden', () => {
    const { rerender } = render(
      <AutoScroll showOption={false}>
        <Messages count={10} />
      </AutoScroll>,
    );
    const container = getContainer();
    setLayout(container, { scrollHeight: 1000, clientHeight: 200 });
    scrollContainer(container, 800);
    scrollContainer(container, 300);
    scrollTo.mockClear();

    rerender(
      <AutoScroll showOption={false}>
        <Messages count={11} />
      </AutoScroll>,
    );

    expect(scrollTo).toHaveBeenCalled();
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  it('blocks pointer events and hides the option with preventInteraction', () => {
    render(<AutoScroll preventInteraction />);

    expect(getContainer().style.pointerEvents).toBe('none');
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  describe('pausing as soon as the person scrolls up', () => {
    const setup = (props: { showOption?: boolean } = {}) => {
      render(
        <AutoScroll optionText="Follow" {...props}>
          <Messages count={10} />
        </AutoScroll>,
      );
      const container = getContainer();
      setLayout(container, { scrollHeight: 1000, clientHeight: 200 });
      container.scrollTop = 800;

      return container;
    };

    const isFollowing = () => screen.getByLabelText<HTMLInputElement>('Follow').checked;

    // Regression: the browser animates wheel scrolling, and scrolling to new content cancelled it
    // before a scroll event fired, so fast-moving content never paused.
    it('pauses on a wheel up, before any scroll event', () => {
      fireEvent.wheel(setup(), { deltaY: -100 });

      expect(isFollowing()).toBe(false);
    });

    it('keeps following on a wheel down', () => {
      fireEvent.wheel(setup(), { deltaY: 100 });

      expect(isFollowing()).toBe(true);
    });

    it('keeps following when there is nowhere to scroll up to', () => {
      const container = setup();
      container.scrollTop = 0;
      fireEvent.wheel(container, { deltaY: -100 });

      expect(isFollowing()).toBe(true);
    });

    it.each(['PageUp', 'ArrowUp', 'Home'])('pauses on %s', (key) => {
      fireEvent.keyDown(setup(), { key });

      expect(isFollowing()).toBe(false);
    });

    it('keeps following on keys that scroll down', () => {
      fireEvent.keyDown(setup(), { key: 'PageDown' });

      expect(isFollowing()).toBe(true);
    });

    it('pauses when a finger drags the content down', () => {
      const container = setup();
      fireEvent.touchStart(container, { touches: [{ clientY: 100 }] });
      fireEvent.touchMove(container, { touches: [{ clientY: 140 }] });

      expect(isFollowing()).toBe(false);
    });

    it('keeps following when a finger drags the content up', () => {
      const container = setup();
      fireEvent.touchStart(container, { touches: [{ clientY: 140 }] });
      fireEvent.touchMove(container, { touches: [{ clientY: 100 }] });

      expect(isFollowing()).toBe(true);
    });

    const pauseAt = (container: HTMLElement, top: number) => {
      fireEvent.wheel(container, { deltaY: -100 });
      container.scrollTop = top;
    };

    // Regression: new content moved the bottom before the wheel animation reached it, so scrolling
    // back down never resumed.
    it('resumes on a wheel down that reaches the bottom, before any scroll event', () => {
      const container = setup();
      pauseAt(container, 500);
      fireEvent.wheel(container, { deltaY: 300 });

      expect(isFollowing()).toBe(true);
    });

    it('stays paused on a wheel down that stops short of the bottom', () => {
      const container = setup();
      pauseAt(container, 300);
      fireEvent.wheel(container, { deltaY: 100 });

      expect(isFollowing()).toBe(false);
    });

    it('counts wheel events that scroll by lines or pages', () => {
      const container = setup();
      pauseAt(container, 500);
      fireEvent.wheel(container, { deltaY: 3, deltaMode: 1 });
      expect(isFollowing()).toBe(false);

      fireEvent.wheel(container, { deltaY: 2, deltaMode: 2 });
      expect(isFollowing()).toBe(true);
    });

    it.each([
      ['End', 0],
      ['PageDown', 650],
      ['ArrowDown', 770],
    ])('resumes on %s near the bottom', (key, top) => {
      const container = setup();
      pauseAt(container, top);
      fireEvent.keyDown(container, { key });

      expect(isFollowing()).toBe(true);
    });

    it('stays paused on PageDown far from the bottom', () => {
      const container = setup();
      pauseAt(container, 100);
      fireEvent.keyDown(container, { key: 'PageDown' });

      expect(isFollowing()).toBe(false);
    });

    it('never pauses when the option is hidden', () => {
      const { rerender } = render(
        <AutoScroll showOption={false}>
          <Messages count={10} />
        </AutoScroll>,
      );
      const container = getContainer();
      setLayout(container, { scrollHeight: 1000, clientHeight: 200 });
      container.scrollTop = 800;
      fireEvent.wheel(container, { deltaY: -100 });
      fireEvent.keyDown(container, { key: 'PageUp' });
      scrollTo.mockClear();

      rerender(
        <AutoScroll showOption={false}>
          <Messages count={11} />
        </AutoScroll>,
      );

      expect(scrollTo).toHaveBeenCalled();
    });
  });
});
