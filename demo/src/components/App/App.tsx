import faker from 'faker';
import React from 'react';

import AutoScroll from 'react-auto-scroll';
import LogoIcon from '../LogoIcon';

import './_app.scss';

const baseClass = 'app';

/**
 * App component.
 */
export default () => (
  <div className={baseClass}>
    <header className={`${baseClass}__header`}>
      <LogoIcon />

      <a className={`${baseClass}__header-link`} href="https://www.brianmcallister.com">
        Brian Wm. McAllister
      </a>

      <div className={`${baseClass}__header-links`}>
        <a href="https://github.com/brianmcallister/react-highlight-text">GitHub</a>
        <a href="https://npmjs.com/package/@brianmcallister/react-highlight-text">npm</a>
      </div>
    </header>

    <div className={`${baseClass}__content`}>
      hello

      <div className={`${baseClass}__msg-container`}>
        <AutoScroll>
          msg
        </AutoScroll>
      </div>
    </div>
  </div>
);
