import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { seconds } from 'src/lib/time';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { ClearIconButton } from 'src/components/Button/ClearIconButton';
import { noop } from 'src/lib/util';
import cx from 'classnames';
import { CustomTheme } from 'src/theme';

type Props = {
  value: string;
  onCopied?: () => void;
  className?: string;
};

export const MiniClipboardCopyButton: React.FC<Props> = ({ value, onCopied = noop, className }) => {
  const cls = useStyles();
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

  if (copied) {
    return (
      <ClearIconButton icon={faCheck} className={cx(cls.checkIcon, className)} tooltip="Copied!" />
    );
  }

  return (
    <ClearIconButton icon={faCopy} className={className} onClick={copy} title="Copy to Clipboard" />
  );
};

const useStyles = createUseStyles((theme) => ({
  checkIcon: {
    color: theme.colors.positiveDarker,
  },
  copyIcon: {
    cursor: 'pointer',
    color: theme.text.baseColor,

    '&:hover': {
      opacity: 0.5,
    },
  },
}));
