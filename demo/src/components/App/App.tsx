import AutoScroll from '@brianmcallister/react-auto-scroll';
// import faker from 'faker';
import React from 'react';

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

      <div className={`${baseClass}__options`}>
        <div>


          <label>
            Prevent interaction
            <input type="checkbox" />
          </label>

        </div>

        <div>
          <input type="checkbox" />

          <label>Show auto scroll option</label>
        </div>

        <div>
          <input type="text" />

          <label>Auto scroll text</label>
        </div>

        <div>
          <input type="range" />

          <label>Height</label>
        </div>
      </div>

      <div className={`${baseClass}__msg-container`}>
        <AutoScroll>
          msg
        </AutoScroll>
      </div>
    </div>
  </div>
);
