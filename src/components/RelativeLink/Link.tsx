import React from 'react';
import { Link as RouterLink, LinkProps } from 'react-router-dom';
import { createUseStyles } from 'src/lib/jss';

type Props = LinkProps;

export const Link: React.FC<Props> = ({ to, ...props }) => {
  const cls = useStyles();

  return <RouterLink to={to} {...props} className={cls.a} />;
};

const useStyles = createUseStyles({
  a: {
    textDecoration: 'none !important',
  },
});
