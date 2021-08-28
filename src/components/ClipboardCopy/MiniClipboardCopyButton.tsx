import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { seconds } from 'src/lib/time';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { colors, text } from 'src/theme';
import { ClearIconButton } from '../Button/ClearIconButton';
import { noop } from 'src/lib/util';

type Props = {
  value: string;
  onCopied?: () => void;
};

export const MiniClipboardCopyButton: React.FC<Props> = ({
  value,
  onCopied = noop,
}) => {
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
    return <ClearIconButton icon={faCheck} className={cls.checkIcon} tooltip="Copied!" />;
  }

  return <ClearIconButton icon={faCopy} onClick={copy} />;
};

const useStyles = createUseStyles({
  checkIcon: {
    color: colors.positiveDarker,
  },
  copyIcon: {
    cursor: 'pointer',
    color: text.baseColor,

    '&:hover': {
      opacity: 0.5,
    },
  },
});
