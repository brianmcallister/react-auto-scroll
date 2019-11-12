# @brianmcallister/react-auto-scroll

<!-- [![codecov](https://codecov.io/gh/brianmcallister/highlight-text/branch/master/graph/badge.svg)](https://codecov.io/gh/brianmcallister/highlight-text) -->

[![CircleCI](https://circleci.com/gh/brianmcallister/react-auto-scroll.svg?style=svg)](https://circleci.com/gh/brianmcallister/react-auto-scroll) [![npm version](https://badge.fury.io/js/%40brianmcallister%2Freact-auto-scroll.svg)](https://badge.fury.io/js/%40brianmcallister%2Freact-auto-scroll)

`react-auto-scroll` is a React component that automatically scrolls a containing element to the bottom.

## Demo

Check out the hosted demo right here: [https://react-auto-scroll.netlify.com/](https://react-auto-scroll.netlify.com/)

## Installation

```sh
npm install @brianmcallister/react-auto-scroll
```

## API

### `AutoScroll`

This is the default export. Use this React component to scroll a container to the bottom when the children change.

```js
interface Props {
  // ID attribute of the checkbox.
  checkBoxId?: string;
  // Children to render in the scroll container.
  children: React.ReactNode;
  // Extra CSS class names.
  className?: string;
  // Height value of the scroll container.
  height?: number;
  // Text to use for the auto scroll option.
  optionText?: string;
  // Prevent all mouse interaction with the scroll conatiner.
  preventInteraction?: boolean;
  // Show the auto scroll option.
  showOption?: boolean;
}
```

#### Example

```js
import AutoScroll from '@brianmcallister/react-auto-scroll';

const MyComponent = ({ someContent }) => (
  <AutoScroll>
    {someContent}
  </AutoScroll>
);
```
