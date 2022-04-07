import React, { useMemo } from 'react';
import { Link, LinkProps, useRouteMatch } from 'react-router-dom';

type Props = LinkProps;

const cleanUrl = (s: string) => s.replace(/([^:])(\/\/+)/g, '$1/');

export const RelativeLink: React.FC<Props> = ({ to, ...props }) => {
  const { url } = useRouteMatch();

  const sanitizedPath = useMemo(() => cleanUrl(`${url}/${to}`), [url, to]);

  return <Link to={sanitizedPath} {...props} />;
};
