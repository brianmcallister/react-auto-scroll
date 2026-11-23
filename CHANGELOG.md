# Changelog

## 2.0.0

### Breaking changes

- React is a peer dependency of version 18 or later. Version 1 supported React 16.8.
- The package has an `exports` map, so deep imports from `dist/` no longer work.

### Fixes

- Only the mouse wheel paused auto scrolling. Scrolling up with the keyboard, touch or the scrollbar now pauses it too.
- When content arrived quickly, scrolling to it cancelled the browser's scroll animation, so scrolling up or back down to the bottom often didn't register. Auto scrolling now pauses and resumes as soon as you start scrolling.
- Scrolling back to the bottom compared sizes exactly, which never matched at subpixel sizes, such as when the page is zoomed. It also measured the container with its borders.
- The default checkbox ID was random and changed on every render, which broke server rendering. It's now generated with `useId`.
- The first scroll to the bottom relied on a timeout that changed the container's style. It now happens in a layout effect, without changing styles.
- Content that changed without a React render didn't scroll. A `MutationObserver` now catches it.

### Other changes

- Ships ES modules and CommonJS, with TypeScript types for both, and the props type is exported as `AutoScrollProps`. Built with tsup and tested with Vitest. CI runs on GitHub Actions, and releases are published from GitHub with npm provenance.
- No longer depends on `classnames`.
