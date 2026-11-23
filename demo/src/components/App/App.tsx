import AutoScroll from '@brianmcallister/react-auto-scroll';
import { useEffect, useId, useState } from 'react';

import { logLine } from '../../fake';
import LogoIcon from '../LogoIcon';

import './_app.scss';

const DEFAULT_HEIGHT = 300;
const MAX_MESSAGES = 200;
const baseClass = 'app';

interface Message {
  id: number;
  text: string;
}

let nextId = 0;

/**
 * A labeled checkbox styled as a switch.
 */
const Toggle = ({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) => {
  const id = useId();

  return (
    <div className={`${baseClass}__option`}>
      <label htmlFor={id}>{label}</label>
      <input
        checked={checked}
        className={`${baseClass}__switch`}
        id={id}
        onChange={(event) => {
          onChange(event.target.checked);
        }}
        role="switch"
        type="checkbox"
      />
    </div>
  );
};

/**
 * App component.
 */
const App = () => {
  const [smoothScroll, setSmoothScroll] = useState(true);
  const [preventInteraction, setPreventInteraction] = useState(false);
  const [showOption, setShowOption] = useState(true);
  const [optionText, setOptionText] = useState('Auto scroll');
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [messages, setMessages] = useState<Message[]>([]);
  const textId = useId();
  const heightId = useId();

  // Add a log line every so often, keeping the most recent ones.
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        return;
      }

      setMessages((current) =>
        current.concat({ id: nextId++, text: logLine() }).slice(-MAX_MESSAGES),
      );
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

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
          <Toggle
            checked={preventInteraction}
            label="Prevent interaction"
            onChange={setPreventInteraction}
          />
          <Toggle checked={showOption} label="Show auto scroll option" onChange={setShowOption} />
          <Toggle
            checked={!smoothScroll}
            label="Disable smooth scroll"
            onChange={(checked) => {
              setSmoothScroll(!checked);
            }}
          />

          <div className={`${baseClass}__option`}>
            <label htmlFor={textId}>Option text</label>
            <input
              className={`${baseClass}__text`}
              id={textId}
              onChange={(event) => {
                setOptionText(event.target.value);
              }}
              value={optionText}
            />
          </div>

          <div className={`${baseClass}__option`}>
            <label htmlFor={heightId}>Height: {height}px</label>
            <input
              className={`${baseClass}__range`}
              id={heightId}
              max={400}
              min={250}
              onChange={(event) => {
                setHeight(Number(event.target.value));
              }}
              type="range"
              value={height}
            />
          </div>
        </div>

        <div className={`${baseClass}__msg-container`}>
          <AutoScroll
            height={height}
            optionText={optionText}
            preventInteraction={preventInteraction}
            scrollBehavior={smoothScroll ? 'smooth' : 'auto'}
            showOption={showOption}
          >
            {messages.map((message) => (
              <div key={message.id} className={`${baseClass}__msg`}>
                {message.text}
              </div>
            ))}
          </AutoScroll>
        </div>
      </div>
    </div>
  );
};

export default App;
