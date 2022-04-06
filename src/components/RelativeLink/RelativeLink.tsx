import React from 'react';
import { Link, LinkProps, useRouteMatch } from 'react-router-dom';

type Props = LinkProps;

export const RelativeLink: React.FC<Props> = ({ to, ...props }) => {
  const { path } = useRouteMatch();

  return <Link to={`${path}/${to}`} {...props} />;
};
