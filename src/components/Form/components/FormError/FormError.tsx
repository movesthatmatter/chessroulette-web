import React from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { CustomTheme } from 'src/theme';

type Props = {
  message: string;
};

export const FormError: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <Text size="small1">{props.message}</Text>
    </div>
  );
};

const useStyles = createUseStyles(theme => ({
  container: {
    color: theme.colors.negativeLight,
    paddingLeft: '12px',
    paddingBottom: '16px',
    textAlign: 'center',
  },
}));