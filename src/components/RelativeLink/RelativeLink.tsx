import React, { useMemo } from 'react';
import { Link, LinkProps, useRouteMatch } from 'react-router-dom';
import { createUseStyles } from 'src/lib/jss';

type Props = LinkProps;

const cleanUrl = (s: string) => s.replace(/([^:])(\/\/+)/g, '$1/');

export const RelativeLink: React.FC<Props> = ({ to, ...props }) => {
  const { url } = useRouteMatch();
  const cls = useStyles();

  const sanitizedPath = useMemo(() => cleanUrl(`${url}/${to}`), [url, to]);

  return <Link to={sanitizedPath} {...props} className={cls.a} />;
};

const useStyles = createUseStyles({
  a: {
    textDecoration: 'none !important',
  },
});