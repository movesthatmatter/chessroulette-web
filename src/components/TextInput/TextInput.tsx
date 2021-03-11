import React from 'react';
import { createUseStyles, CSSProperties, makeImportant } from 'src/lib/jss';
import { colors } from 'src/theme';
import { TextInput as GTextInput } from 'grommet';
import { Text } from '../Text/Text';
import cx from 'classnames';


type Props = Omit<React.ComponentProps<typeof GTextInput>, | 'plain' | 'size' | 'ref'> & {
  className?: string;
  label?: string;
  validationError?: string;
};

export const TextInput: React.FC<Props> = ({
  className,
  label,
  value,
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
      <div className={cx(cls.inputWrapper, props.validationError && cls.errorInputWrapper)}>
        <GTextInput
          value={value}
          plain
          size="small"
          className={cx(
            cls.textInput,
            props.readOnly && cls.readonly,
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

const useStyles = createUseStyles({
  container: {
    marginBottom: '16px',

    ...{
      '&:first-child $labelWrapper': {
        marginTop: '0', // Remove the Negative Margin for the first element!
      }
    } as CSSProperties['nestedKey'],
  },
  labelWrapper: {
    paddingBottom: '4px',
    paddingLeft: '12px',
    marginTop: '-12px',
  },
  inputWrapper: {
    border: `1px solid ${colors.neutral}`,
    borderRadius: '40px',
    overflow: 'hidden',
  },
  errorInputWrapper: {
    borderColor: colors.negative,
  },
  textInput: {
    ...makeImportant({
      fontSize: '13px',
      fontWeight: 'normal',
      height: '32px',

      // These are needed for WebViews on IOS
      //  since the body takes them out!
      userSelect: 'auto',
      WebkitTapHighlightColor: 'initial',
      WebkitTouchCallout: 'default',
    }),
  },
  readonly: {
    ...makeImportant({
      background: colors.neutralLightest,
    }),
  },
  errorMessageWrapper: {
    color: colors.negativeLight,
    paddingLeft: '12px',
  },
});