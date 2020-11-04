import React from 'react';
import { createUseStyles } from 'src/lib/jss';

type Props = JSX.IntrinsicElements['span'] & {
  size?: 'small1' | 'small2';
};

export const Text: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <span {...props}>{props.children}</span>
  );
};

const useStyles = createUseStyles({
  container: {
    
  },
});