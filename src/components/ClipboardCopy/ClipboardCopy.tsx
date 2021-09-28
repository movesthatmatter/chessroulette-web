import React, { useState } from 'react';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { Box, TextInput, Button } from 'grommet';
import { noop } from 'src/lib/util';
import { colors, onlyMobile } from 'src/theme';
import { seconds } from 'src/lib/time';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import cx from 'classnames';

type Props = {
  value: string;
  // @deprecate This doesnt work in some environemnts (ios)
  autoCopy?: boolean;
  onCopied?: () => void;
  copyButtonLabel?: string;
  readonly?: boolean;
};

export const ClipboardCopy: React.FC<Props> = ({ onCopied = noop, copyButtonLabel, ...props }) => {
  const cls = useStyles();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(props.value);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, seconds(2));

      onCopied();
    } catch (e) {}
  };

  return (
    <Box
      direction="row"
      className={cx(
        cls.container,
        copied && cls.containerCopied,
        props.readonly && cls.readonlyContainer
      )}
      fill
    >
      <TextInput
        value={props.value}
        plain
        size="small"
        className={cls.textInput}
        readOnly={props.readonly}
      />
      <Button
        {...(copyButtonLabel
          ? {
              label: <div className={cls.buttonLabelWrapper}>{copyButtonLabel}</div>,
              icon: (
                <FontAwesomeIcon
                  icon={copied ? faCheck : faCopy}
                  color={colors.neutralDarkest}
                  className={cls.copyIcon}
                />
              ),
            }
          : {
              icon: (
                <FontAwesomeIcon
                  icon={copied ? faCheck : faCopy}
                  color={colors.neutralDarkest}
                  className={cls.copyIcon}
                />
              ),
            })}
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
    transition: 'border 150ms ease-in',
  },
  containerCopied: {
    borderColor: colors.positive,
  },
  readonlyContainer: {
    background: colors.neutral,
  },
  textInput: {
    ...makeImportant({
      fontSize: '13px',
      fontWeight: 'normal',
      height: '32px',

      // These are needed for WebViews on IOS
      //  since the boody takes them out!
      userSelect: 'auto',
      WebkitTapHighlightColor: 'initial',
      WebkitTouchCallout: 'default',
    }),

    ...onlyMobile({
      ...makeImportant({
        fontSize: '12px',
        height: '28px',
      }),
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
    display: 'flex',

    ...onlyMobile({
      width: '14px !important',
    }),
  },
  buttonLabelWrapper: {
    color: colors.neutralDarkest,
    whiteSpace: 'nowrap',
  },
});
