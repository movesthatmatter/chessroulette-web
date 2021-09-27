import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { CustomTheme } from 'src/theme';
import { Text } from '../Text';

type Props = {
  text?: string;
};

export const Hr: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <div className={cls.side}>
        <div className={cls.line} />
      </div>
      {props.text && (
        <div className={cls.content}>
          <Text size="small1" className={cls.text}>
            {props.text}
          </Text>
        </div>
      )}
      <div className={cls.side}>
        <div className={cls.line} />
      </div>
    </div>
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  container: {
    textAlign: 'center',
    lineHeight: '15px',
    display: 'flex',
    flexDirection: 'row',
  },
  side: {
    flex: 1,
    position: 'relative',
  },
  content: {
    padding: '0 16px',
  },
  text: {
    margin: 0,
    padding: 0,
    lineHeight: '16px',
    color: theme.colors.neutralDarker,
  },
  line: {
    position: 'absolute',
    top: '10px',
    left: 0,
    right: 0,
    borderTop: `1px solid ${theme.colors.neutral}`,
  },
}));
