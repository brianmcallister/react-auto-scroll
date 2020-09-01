# @brianmcallister/react-auto-scroll

[![codecov](https://codecov.io/gh/brianmcallister/react-auto-scroll/branch/master/graph/badge.svg)](https://codecov.io/gh/brianmcallister/react-auto-scroll) [![CircleCI](https://circleci.com/gh/brianmcallister/react-auto-scroll.svg?style=svg)](https://circleci.com/gh/brianmcallister/react-auto-scroll) [![npm version](https://img.shields.io/npm/v/@brianmcallister/react-auto-scroll?label=version&color=%2354C536&logo=npm)](https://www.npmjs.com/package/@brianmcallister/react-auto-scroll)

> Automatically scroll an element to the bottom

`react-auto-scroll` is a React component that automatically scrolls a containing element to the bottom.

## Table of contents

- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
	- [`AutoScroll`](#autoscroll)

## Demo

Hosted demo: [https://react-auto-scroll.netlify.com/](https://react-auto-scroll.netlify.com/)

You can also run the demo locally. To get started:

```sh
git clone git@github.com:brianmcallister/react-auto-scroll.git
cd react-auto-scroll/demo
npm i
# Optionally link libraries for local development
npm link @brianmcallister/react-auto-scroll
npm link ../node_modules/react
npm start
```

###### [⇡ Top](#table-of-contents)

## Installation

```sh
npm install @brianmcallister/react-auto-scroll
```

###### [⇡ Top](#table-of-contents)

## Usage

```js
import AutoScroll from '@brianmcallister/react-auto-scroll';

const MyComponent = ({ someContent }) => (
  <AutoScroll>
    {someContent}
  </AutoScroll>
);
```

###### [⇡ Top](#table-of-contents)

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
    // Ability to disable the smooth scrolling behavior.
  scrollBehavior?: 'smooth' | 'auto';
  // Show the auto scroll option.
  showOption?: boolean;
}
```

###### [⇡ Top](#table-of-contents)
