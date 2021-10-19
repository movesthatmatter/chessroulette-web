/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { ClipboardCopy } from './ClipboardCopy';
import { action } from '@storybook/addon-actions';

export default {
  component: ClipboardCopy,
  title: 'components/ClipboardCopy',
};

export const defaultStory = () => (
  <div
    style={{
      width: '320px',
    }}
  >
    <ClipboardCopy value="Press on the button to copy me" onCopied={action('copied')} />
    <br/>
    <ClipboardCopy value="Press on the button to copy me" copyButtonLabel="Label" onCopied={action('copied')} />
  </div>
);

export const withAutoCopy = () => (
  <div
    style={{
      width: '320px',
    }}
  >
    <ClipboardCopy value="This should auto copy" autoCopy onCopied={action('copied')} />
  </div>
);

export const readonly = () => (
  <div
    style={{
      width: '320px',
    }}
  >
    <ClipboardCopy value="This should auto copy" autoCopy onCopied={action('copied')} readonly />
  </div>
);
