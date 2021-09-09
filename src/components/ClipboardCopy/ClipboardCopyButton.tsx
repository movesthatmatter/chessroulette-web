import React, { useState } from 'react';
import { Button, ButtonProps } from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { seconds } from 'src/lib/time';
import { noop } from 'src/lib/util';
import { createUseStyles } from 'src/lib/jss';
import { colors } from 'src/theme';

type Props = Omit<ButtonProps, 'onClick'> & {
  value: string;
  copiedlLabel?: string;
  onCopied?: () => void;
};

export const ClipboardCopyButton: React.FC<Props> = ({
  value,
  copiedlLabel = 'Copied',
  onCopied = noop,
  ...buttonProps
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

  return (
    <Button
      onClick={copy}
      icon={() => <FontAwesomeIcon icon={copied ? faCheck : faCopy} className={cls.icon} />}
      {...buttonProps}
      label={copied ? copiedlLabel : buttonProps.label}
    />
  );
};

const useStyles = createUseStyles({
  icon: {
    color: colors.white,
  },
});
