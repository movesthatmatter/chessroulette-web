import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import logo from 'src/assets/logo.svg';
import logoWhite from 'src/assets/logo_white.svg';
import { onlyMobile } from 'src/theme';

type Props = {
  asLink?: boolean;
  darkMode?: boolean,
};

export const Logo: React.FC<Props> = ({
  asLink = true,
  darkMode = false,
}) => {
  const cls = useStyles();

  return (
    <a {...{
      ...asLink && {
        href: '/',
      }
    }}
      className={cls.container}
    >
      <img
        src={darkMode ? logoWhite : logo }
        alt="logo"
        className={cls.img}
      />
    </a>
  );
};

const useStyles = createUseStyles({
  container: {
    width: '160px',
    position: 'relative',
    display: 'block',

    ...onlyMobile({
      width: '100%',
      maxWidth: '140px',
      minWidth: '100px',
    }),
  },
  img: {
    width: '100%',
  },
});