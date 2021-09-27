import React from 'react';
import { createUseStyles, CSSProperties, makeImportant } from 'src/lib/jss';
import { CustomTheme, effects, onlyMobile } from 'src/theme';
import { Text } from '../Text/Text';
import cx from 'classnames';
import { getBoxShadow } from 'src/theme/util';
import hexToRgba from 'hex-to-rgba';
import { HTMLInputElement } from 'window-or-global';


export type TextInputProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  className?: string;
  label?: string;
  validationError?: string;
  readOnly?: boolean;
};

export const TextInput: React.FC<TextInputProps> = ({
  className,
  label,
  ...props
}) => {
  const cls = useStyles();

  return (
    <div className={cx(cls.container, className)}>
      {label && (
        <div className={cls.labelWrapper}>
          <Text size="small2">{label}</Text>
        </div>
      )}
      <div className={cx(cls.inputWrapper)}>
        <input
          readOnly={props.readOnly}
          type='text'
          value={props.defaultValue}
          className={cx(
            cls.textInput,
            props.validationError && cls.errorInput,
          )}
          {...props}
        />
      </div>
      {props.validationError && (
        <div className={cls.errorMessageWrapper}>
          <Text size="small1">{props.validationError}</Text>
        </div>
      )}
    </div>
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  container: {
    marginBottom: '12px',

    ...onlyMobile({
      marginBottom: '2px',
    }),

    ...{
      '&:first-child $labelWrapper': {
        marginTop: '0', // Remove the Negative Margin for the first element!
      }
    } as CSSProperties['nestedKey'],
  },
  labelWrapper: {
    paddingBottom: '4px',
    paddingLeft: '12px',

    ...onlyMobile({
      paddingBottom: 0,
    }),
  },
  inputWrapper: {},
  textInput: {
    color: theme.colors.text,
    width: '100%',
    boxSizing: 'border-box',
    paddingLeft: '11px',
    ...{
      '&:read-only': {
        ...makeImportant({
          background: theme.colors.neutralLighter,
        }),
        '&:focus': {
          boxShadow: 'none',
        }
      },
      '&:focus': {
        ...effects.floatingShadow,
        outline: 'none !important'
      }
    } as CSSProperties,
    ...makeImportant({
      border: `1px solid ${theme.colors.neutral}`,
      borderRadius: '40px',
      backgroundColor: theme.colors.textInputBackground,

      fontSize: '13px',
      fontWeight: 'normal',
      height: '32px',

      // These are needed for WebViews on IOS
      //  since the body takes them out!
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
  errorInput: {
    ...makeImportant({
      borderColor: theme.colors.negative,
      boxShadow: getBoxShadow(0, 12, 26, 0, hexToRgba(theme.colors.negative, 0.08)),
    }),
  },
  errorMessageWrapper: {
    color: theme.colors.negativeLight,
    paddingLeft: '12px',
  },
}));