import React from 'react';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { colors } from 'src/theme';
import { TextInput as GTextInput, TextInputProps } from 'grommet';

type Props = TextInputProps & {
  className?: string;
};

export const TextInput: React.FC<Props> = ({
  size,
  className,
  ...props
}) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <GTextInput value={props.value} plain size="small" className={cls.textInput} />
    </div>
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

       // These are needed for WebViews on IOS
      //  since the boody takes them out!
      userSelect: 'auto',
      WebkitTapHighlightColor: 'initial',
      WebkitTouchCallout: 'default',
    }),
  },
});