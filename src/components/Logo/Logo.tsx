import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import logo from 'src/assets/logo.svg';

type Props = {
  asLink?: boolean;
};

export const Logo: React.FC<Props> = ({
  asLink = true,
}) => {
  const cls = useStyles();

  return (
    <a {...{
      ...asLink && {
        href: '/',
      }
    }}>
      <img src={logo} alt="logo" className={cls.img} />
    </a>
  );
};

const useStyles = createUseStyles({
  img: {
    width: '200px',
  },
});