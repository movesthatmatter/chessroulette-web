import React, { useState } from 'react';
import { seconds } from 'src/lib/time';
import { noop } from 'src/lib/util';

type Props = {
  value: string;
  onCopied?: () => void;
  render: (p: { copied: boolean; copy: () => void }) => React.ReactNode;
};

export const ClipboardCopyWidget: React.FC<Props> = ({ value, render, onCopied = noop }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, seconds(2));

      onCopied();
    } catch (e) {}
  };

  return <>{render({ copied, copy })}</>;
};
