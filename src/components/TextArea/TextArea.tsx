import React, { useState } from 'react';
import { createUseStyles, CSSProperties, makeImportant, NestedCSSElement } from 'src/lib/jss';
import { CustomTheme, effects, onlyMobile } from 'src/theme';
import { Text } from '../Text/Text';
import cx from 'classnames';
import { getBoxShadow } from 'src/theme/util';
import hexToRgba from 'hex-to-rgba';
import { HTMLTextAreaElement } from 'window-or-global';
import { spacers } from 'src/theme/spacers';

type Props = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  className?: string;
  label?: string;
  validationError?: string;
  hasValidationError?: boolean;
};

export const TextArea: React.FC<Props> = ({ className, label, value, ...props }) => {
  const cls = useStyles();
  const [isFocused, setIsFocused] = useState(false);
  const isInvalid = props.hasValidationError || props.validationError;

  return (
    <div className={cx(cls.container, className)}>
      {label && (
        <div className={cls.labelWrapper}>
          <Text size="small2">{label}</Text>
        </div>
      )}
      <div
        className={cx(
          cls.inputWrapper,
          isFocused && cls.inputWrapperFocused,
          props.readOnly && cls.inputWrapperReadonly,
          isInvalid && cls.inputWrapperError
        )}
      >
        <div className={cls.topPadding} />
        <div className={cx(cls.textAreaWrapper)}>
          <textarea
            value={value}
            className={cx(cls.textArea)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        </div>
        <div className={cx(cls.bottomPadding)} />
      </div>
      {props.validationError && (
        <div className={cls.errorMessageWrapper}>
          <Text size="small1">{props.validationError}</Text>
        </div>
      )}
    </div>
  );
};

const padding = spacers.get(0.75);

const useStyles = createUseStyles<CustomTheme>(theme => ({
  container: {
    marginBottom: '12px',

    ...onlyMobile({
      marginBottom: '2px',
    }),

    ...({
      '&:first-child $labelWrapper': {
        marginTop: '0', // Remove the Negative Margin for the first element!
      },
    } as CSSProperties['nestedKey']),
  },
  labelWrapper: {
    paddingBottom: spacers.smaller,
    paddingLeft: padding,

    ...onlyMobile({
      paddingBottom: 0,
    }),
  },
  topPadding: {
    background: 'white',
    height: '16px',
    marginBottom: '-2px',
    borderTopLeftRadius: '40px',
    borderTopRightRadius: '40px',
    borderStyle: 'solid',
    borderColor: theme.colors.neutral,
    borderWidth: 0,
    borderTopWidth: `1px`,
    borderLeftWidth: `1px`,
    borderRightWidth: `1px`,
  },
  bottomPadding: {
    background: 'white',
    height: '16px',
    marginTop: '-2px',
    borderStyle: 'solid',
    borderColor: theme.colors.neutral,
    borderWidth: 0,
    borderBottomWidth: `1px`,
    borderLeftWidth: `1px`,
    borderRightWidth: `1px`,
    borderBottomLeftRadius: '40px',
    borderBottomRightRadius: '40px',
  },
  inputWrapper: {
    ...({
      '&$inputWrapperFocused $bottomPadding': {
        ...effects.floatingShadow,
      },
      '&$inputWrapperFocused $topPadding': {
        ...effects.floatingShadow,
      },
      '&$inputWrapperFocused $textAreaWrapper': {
        overflow: 'hidden',
        ...effects.floatingShadow,
      },
    } as CSSProperties),
  },
  inputWrapperFocused: {},
  inputWrapperError: {
    ...makeImportant({
      '& $topPadding': {
        borderColor: theme.colors.negative,
        boxShadow: getBoxShadow(0, 12, 26, 0, hexToRgba(theme.colors.negative, 0.08)),
      },
      '& $bottomPadding': {
        borderColor: theme.colors.negative,
        boxShadow: getBoxShadow(0, 12, 26, 0, hexToRgba(theme.colors.negative, 0.08)),
      },
      '& $textAreaWrapper': {
        borderColor: theme.colors.negative,
        boxShadow: getBoxShadow(0, 12, 26, 0, hexToRgba(theme.colors.negative, 0.08)),
      },
    } as CSSProperties),
  },
  inputWrapperReadonly: {
    ...makeImportant({
      '& $topPadding': {
        background: theme.colors.neutralLighter,
        boxShadow: 'none',
      },
      '& $bottomPadding': {
        background: theme.colors.neutralLighter,
        boxShadow: 'none',
      },
      '& $textAreaWrapper': {
        background: theme.colors.neutralLighter,
        boxShadow: 'none',
      },
    } as CSSProperties),

    ...({
      '&$inputWrapperFocused': {
        boxShadow: 'none',
      },
    } as NestedCSSElement),
  },
  textAreaWrapper: {
    background: 'white',
    display: 'flex',
    paddingLeft: padding,
    paddingRight: padding,
    borderStyle: 'solid',
    borderColor: theme.colors.neutral,
    borderWidth: 0,
    borderLeftWidth: `1px`,
    borderRightWidth: `1px`,
  },
  textArea: {
    width: '100%',
    lineHeight: '1.5em',

    resize: 'vertical', // Limit the resizing only for vertical

    ...makeImportant({
      padding: 0,
      margin: 0,
    }),

    ...({
      '&:read-only': {
        ...makeImportant({
          background: theme.colors.neutralLighter,
        }),
        '&:focus': {
          boxShadow: 'none',
        },
      },
      '&:focus-visible': {
        outline: 'none',
      },
    } as CSSProperties),

    ...makeImportant({
      border: 0,
      fontSize: '13px',
      fontWeight: 'normal',
      fontFamily: 'Lato, Open Sans, sans-serif',

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
  errorInput: {},
  errorMessageWrapper: {
    color: theme.colors.negativeLight,
    paddingLeft: '12px',
  },
}));
