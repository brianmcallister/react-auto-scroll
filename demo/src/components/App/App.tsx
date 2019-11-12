import AutoScroll from '@brianmcallister/react-auto-scroll';
import faker from 'faker';
import React from 'react';
import { Label, FocusStyleManager, Switch, Slider, InputGroup, FormGroup } from '@blueprintjs/core';

import LogoIcon from '../LogoIcon';

import './_app.scss';

FocusStyleManager.onlyShowFocusOnTabs();

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
  const [messages, setMessages] = React.useState<string[]>([]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        return;
      }

      const msg = [
        faker.internet.protocol(),
        `/${faker.system.commonFileType()}/${faker.system.commonFileName(faker.system.commonFileExt())}`,
        faker.random.number(),
        faker.system.mimeType(),
        faker.system.semver(),
        faker.random.locale(),
      ];

      setMessages(messages.concat([msg.join(' ')]));
    }, 100);

    return () => clearInterval(interval);
  }, [messages]);

  return (
    <div className={baseClass}>
      <header className={`${baseClass}__header`}>
        <LogoIcon />

        <a className={`${baseClass}__header-link`} href="https://www.brianmcallister.com">
          Brian Wm. McAllister
        </a>

        <div className={`${baseClass}__header-links`}>
          <a href="https://github.com/brianmcallister/react-auto-scroll">GitHub</a>
          <a href="https://npmjs.com/package/@brianmcallister/react-auto-scroll">npm</a>
        </div>
      </header>

      <div className={`${baseClass}__content`}>
        <div className={`${baseClass}__options`}>
          <div className={`${baseClass}__option`}>
            <Label htmlFor="prevent">
              Prevent interaction
            </Label>

            <Switch
              id="prevent"
              onChange={() => setPreventInteraction(!preventInteraction)}
              checked={preventInteraction}
              large
              inline
              alignIndicator="right"
            />
          </div>

          <div className={`${baseClass}__option`}>
            <Label htmlFor="option">
              Show auto scroll option
            </Label>

            <Switch
              id="option"
              onChange={() => setAutoScroll(!autoScroll)}
              checked={autoScroll}
              large
              inline
              alignIndicator="right"
            />
          </div>

          <FormGroup className={`${baseClass}__option`} label="Option text">
            <InputGroup
              value={optionText}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
                setOptionText(event.currentTarget.value)
              )}
            />
          </FormGroup>

          <FormGroup className={`${baseClass}__option`} label="Height">
            <Slider
              onChange={setHeight}
              min={250}
              max={400}
              value={height}
            />
          </FormGroup>
        </div>

        <div className={`${baseClass}__msg-container`}>
          <AutoScroll
            preventInteraction={preventInteraction}
            showOption={autoScroll}
            optionText={optionText}
            height={height}
          >
            {messages.map(msg => {
              return (
                <div key={msg} className={`${baseClass}__msg`}>
                  {msg}
                </div>
              );
            })}
          </AutoScroll>
        </div>
      </div>
    </div>
  );
}
