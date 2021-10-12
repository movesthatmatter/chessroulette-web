import React, { useState } from 'react';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { noop } from 'src/lib/util';
import { CustomTheme, themes, onlyMobile } from 'src/theme';
import { seconds } from 'src/lib/time';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import cx from 'classnames';
import { Button } from '../Button';
import { TextInput } from '../TextInput';

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
    <div
      style={{display:'flex', flexDirection:'row', height:'100%', width:'100%'}}
      className={cx(
        cls.container,
        copied && cls.containerCopied,
        props.readonly && cls.readonlyContainer
      )}
    >
      <TextInput
        defaultValue={props.value}
        className={cls.textInput}
        readOnly={props.readonly}
      />
      <Button
        {...(copyButtonLabel
          ? {
              label: copyButtonLabel,
              icon: () => (
                <FontAwesomeIcon
                  icon={copied ? faCheck : faCopy}
                  color={themes.lightDefault.colors.neutralDarkest}
                  className={cls.copyIcon}
                />
              ),
            }
          : {
              label:'',
              icon:() => (
                <FontAwesomeIcon
                  icon={copied ? faCheck : faCopy}
                  color={themes.lightDefault.colors.neutralDarkest}
                  className={cls.copyIcon}
                />
              ),
            })}
        className={cx(cls.copyButton)}
        size="small"
        onClick={copy}
      />
    </div>
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  container: {
    border: `1px solid ${theme.colors.neutral}`,
    borderRadius: '40px',
    overflow: 'hidden',
    transition: 'border 150ms ease-in',
  },
  containerCopied: {
    borderColor: theme.colors.positive,
  },
  readonlyContainer: {
    background: theme.colors.neutral,
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
    background: `${theme.colors.neutral} !important`,
    padding: '0 1em 0 .7em !important',

    '&:active': {
      background: `${theme.colors.neutralDark} !important`,
    },

    '&:hover': {
      opacity: 0.8,
    },

    '&:focus': {
      boxShadow: 'none !important',
    },
  },
  copyButtonSuccess: {
    background: `${theme.colors.positive} !important`,
  },
  copyIcon: {
    width: '16px !important',
    display: 'flex',

    ...onlyMobile({
      width: '14px !important',
    }),
  },
  buttonLabelWrapper: {
    color: theme.colors.neutralDarkest,
    whiteSpace: 'nowrap',
  },
}));
