import React, { useState } from 'react';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { Box, TextInput, Button } from 'grommet';
import { Copy } from 'grommet-icons';
import { noop } from 'src/lib/util';
import { colors, onlyMobile, text } from 'src/theme';
import cx from 'classnames';

type Props = {
  value: string;
  // @deprecate This doesnt work in some environemnts (ios)
  autoCopy?: boolean;
  onCopied?: () => void;
};

export const ClipboardCopy: React.FC<Props> = ({
  onCopied = noop,
  ...props
}) => {
  const cls = useStyles();
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(props.value);

    setCopied(true);

    onCopied();
  }

  return (
    <Box direction="row" className={cls.container} fill>
      <TextInput
        value={props.value}
        plain
        size="small"
        className={cls.textInput}
      />
      <Button
        icon={<Copy color={colors.neutralDarkest} className={cls.copyIcon}/>}
        className={cx(cls.copyButton)}
        size="small"
        plain
        focusIndicator
        onClick={copy}
      />
    </Box>
  );
};

const useStyles = createUseStyles({
  container: {
    border: `1px solid ${colors.neutral}`,
    borderRadius: '40px',
    overflow: 'hidden',
  },
  textInput: {
    ...makeImportant({
      fontSize: '13px',
      fontWeight: 'normal',
      height: '32px',
    }),
  },
  copyButton: {
    background: `${colors.neutral} !important`,
    padding: '0 1em 0 .7em !important',

    '&:active': {
      background: `${colors.neutralDark} !important`,
    },

    '&:hover': {
      opacity: 0.8,
    },

    '&:focus': {
      boxShadow: 'none !important',
    },
  },
  copyButtonSuccess: {
    background: `${colors.positive} !important`,
  },
  copyIcon: {
    width: '16px !important',

    ...onlyMobile({
      width: '14px !important',
    }),
  },
});
