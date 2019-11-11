import highlightText from '@brianmcallister/highlight-text/dist/browser';
import React from 'react';

interface Props {
  text: string;
  words: string[];
}

const baseClass = 'highlight-text';

export default ({ text, words }: Props) => (
  <div className={baseClass}>
    <div
      style={{ whiteSpace: 'pre-wrap' }}
      /* eslint-disable-next-line react/no-danger */
      dangerouslySetInnerHTML={{ __html: highlightText(text, words) }}
    />
  </div>
);
