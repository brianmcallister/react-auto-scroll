import AutoScroll from '@brianmcallister/react-auto-scroll';
// import faker from 'faker';
import React from 'react';

import LogoIcon from '../LogoIcon';

import './_app.scss';

const DEFAULT_HEIGHT = 300;
const baseClass = 'app';

/**
 * App component.
 */
export default () => {
  const [preventInteraction, setPreventInteraction] = React.useState(false);
  const [autoScroll, setAutoScroll] = React.useState(true);
  const [optionText, setOptionText] = React.useState('Auto scroll');
  const [height, setHeight] = React.useState(DEFAULT_HEIGHT);

  return (
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
        <div className={`${baseClass}__options`}>
          <div className={`${baseClass}__option-group`}>
            <label>
              <input
                onChange={() => setPreventInteraction(!preventInteraction)}
                type="checkbox"
                checked={preventInteraction}
              />

              Prevent interaction
            </label>

            <label>
              <input
                onChange={() => setAutoScroll(!autoScroll)}
                type="checkbox"
                checked={autoScroll}
              />

              Show auto scroll option
            </label>
          </div>

          <div className={`${baseClass}__option-group`}>
            <label>
              <input
                onChange={(event) => (
                  setOptionText(event.currentTarget.value)
                )}
                type="text"
                value={optionText}
              />

              Auto scroll option text
            </label>

            <label>
              <input
                onChange={(event) => (
                  setHeight(parseInt(event.currentTarget.value, 10))
                )}
                min="250"
                max="400"
                type="range"
              />

              Height
            </label>
          </div>
        </div>

        <div className={`${baseClass}__msg-container`}>
          <AutoScroll
            preventInteraction={preventInteraction}
            showOption={autoScroll}
            optionText={optionText}
            height={height}
          >
            msg
          </AutoScroll>
        </div>
      </div>
    </div>
  );
}
