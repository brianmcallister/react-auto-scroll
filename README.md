<h1>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/brianmcallister/react-auto-scroll/main/.github/assets/logo-dark.svg">
    <img alt="@brianmcallister/react-auto-scroll" src="https://raw.githubusercontent.com/brianmcallister/react-auto-scroll/main/.github/assets/logo-light.svg" height="48">
  </picture>
</h1>

[![CI](https://github.com/brianmcallister/react-auto-scroll/actions/workflows/ci.yml/badge.svg)](https://github.com/brianmcallister/react-auto-scroll/actions/workflows/ci.yml) [![npm version](https://img.shields.io/npm/v/@brianmcallister/react-auto-scroll?label=version&color=%2354C536&logo=npm)](https://www.npmjs.com/package/@brianmcallister/react-auto-scroll)

> Keep a scroll container scrolled to the bottom, in React

`react-auto-scroll` is a React component that automatically scrolls a containing element to the bottom.

## Table of contents

- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [`AutoScroll`](#autoscroll)
- [Upgrading from 1.x](#upgrading-from-1x)

## Demo

Hosted demo: [https://brianmcallister.github.io/react-auto-scroll/](https://brianmcallister.github.io/react-auto-scroll/)

You can also run the demo locally. To get started:

```sh
git clone git@github.com:brianmcallister/react-auto-scroll.git
cd react-auto-scroll/demo
npm i
npm start
```

###### [⇡ Top](#table-of-contents)

## Installation

```sh
npm install @brianmcallister/react-auto-scroll
```

###### [⇡ Top](#table-of-contents)

## Usage

```jsx
import AutoScroll from '@brianmcallister/react-auto-scroll';

const ChatLog = ({ messages }) => (
  <AutoScroll height={400}>
    {messages.map((message) => (
      <p key={message.id}>{message.text}</p>
    ))}
  </AutoScroll>
);
```

`AutoScroll` keeps its container scrolled to the bottom as the content changes. It also notices content that changes without a React render, like text appended by another script.

When the auto scroll option is shown, scrolling up pauses auto scrolling and unchecks the option, so people can read earlier content. Scrolling back to the bottom, or checking the option, resumes it. This works with the mouse wheel, the keyboard, touch and the scrollbar, even while content is arriving quickly.

Works with React 18 and later, including server rendering.

###### [⇡ Top](#table-of-contents)

## API

### `AutoScroll`

The default export, also available as a named export.

```ts
interface AutoScrollProps {
  // ID for the auto scroll checkbox. Defaults to a generated ID.
  checkBoxId?: string;
  // Content to render in the scroll container.
  children?: React.ReactNode;
  // Extra CSS class names.
  className?: string;
  // Height of the scroll container, in pixels.
  height?: number;
  // Label for the auto scroll checkbox. Defaults to 'Auto scroll'.
  optionText?: string;
  // Prevent all mouse interaction with the scroll container. Defaults to false.
  preventInteraction?: boolean;
  // How to scroll to new content. Defaults to 'smooth'. The first scroll is always instant.
  scrollBehavior?: 'smooth' | 'auto';
  // Show the auto scroll checkbox. Defaults to true. Without it, scrolling up doesn't pause.
  showOption?: boolean;
}
```

The markup uses BEM classes you can style: `react-auto-scroll`, `react-auto-scroll__scroll-container`, `react-auto-scroll__option`, `react-auto-scroll__option-input` and `react-auto-scroll__option-text`, plus the modifiers `--empty`, `--prevent-interaction` and `--showOption`.

###### [⇡ Top](#table-of-contents)

## Upgrading from 1.x

The props and markup are the same. What changed:

- React is a peer dependency of version 18 or later, because the component uses `useId`. Version 1 supported React 16.8.
- Scrolling up with the keyboard, touch or scrollbar now pauses auto scrolling, not only the mouse wheel.
- The package has an `exports` map, so deep imports from `dist/` no longer work.

See the [changelog](CHANGELOG.md) for everything else.

###### [⇡ Top](#table-of-contents)
