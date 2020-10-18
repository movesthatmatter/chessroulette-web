import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Box, TextInput, Button } from 'grommet';
import { Clipboard } from 'grommet-icons';

type Props = {
  value: string;
  onCopied?: () => void;
};

export const ClipboardCopy: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <Box direction="row" className={cls.container}>
      <TextInput
        value={props.value}
        plain
        size="small"
        style={{
          fontSize: '13px',
          fontWeight: 'normal',
        }}
      />
      <Button
        icon={<Clipboard color="light-1" />}
        className={cls.copyButton}
        size="small"
        plain
        focusIndicator
        color="dark-1"
        onClick={() => {
          navigator.clipboard.writeText(props.value);
        }}
      />
    </Box>
  );
};

const useStyles = createUseStyles({
  container: {
    border: '1px solid grey',
    borderRadius: '40px',
    overflow: 'hidden',
  },
  copyButton: {
    background: 'grey !important',
    padding: '0 1em 0 .7em !important',
    // color: 'white !important',

    '&:active': {
      opacity: 0.8,
    },

    '&:focus': {
      boxShadow: 'none !important',
    },
  },
});
