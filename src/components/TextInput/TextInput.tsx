import React from 'react';
import { createUseStyles, CSSProperties, makeImportant } from 'src/lib/jss';
import { colors } from 'src/theme';
import { TextInput as GTextInput } from 'grommet';
import { Text } from '../Text/Text';
import cx from 'classnames';


type Props = Omit<React.ComponentProps<typeof GTextInput>, | 'plain' | 'size' | 'ref'> & {
  className?: string;
  label?: string;
};

export const TextInput: React.FC<Props> = ({
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
      <div className={cls.inputWrapper}>
        <GTextInput
          value={props.value}
          plain
          size="small"
          className={cls.textInput}
          {...props}
        />
      </div>
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
});