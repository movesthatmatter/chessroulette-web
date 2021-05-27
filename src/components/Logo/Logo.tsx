import React from 'react';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import logo from 'src/assets/logo.svg';
import logoWhite from 'src/assets/logo_white.svg';
import { onlyMobile, text } from 'src/theme';
import { Badge } from '../Badge';
import cx from 'classnames';
import { Link } from 'react-router-dom';

type Props = {
  asLink?: boolean;
  darkMode?: boolean;
};

export const Logo: React.FC<Props> = ({ asLink = true, darkMode = false }) => {
  const cls = useStyles();

  const content = (
    <div className={cls.container}>
      <img src={darkMode ? logoWhite : logo} alt="Chessroulette Logo" className={cls.img} />
      <Badge
        text="Beta"
        textSize="small2"
        className={cls.badge}
        textClassName={cx(
          cls.badgeText,
          darkMode ? cls.badgeTextWhiteBkg : cls.badgeTextWhiteWhite
        )}
        color="primary"
      />
    </div>
  );

  return asLink ? <Link to="/">{content}</Link> : content;
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
  badge: {
    position: 'absolute',
    right: '-16px',
    top: '-4px',
  },
  badgeText: {
    fontSize: '10px',
    lineHeight: '13px',
    ...makeImportant({
      boxShadow: 'none',
    }),
  },
  badgeTextWhiteBkg: {
    ...makeImportant({
      backgroundColor: 'white',
      color: text.baseColor,
      boxShadow: 'none',
    }),
  },
  badgeTextWhiteWhite: {
    ...makeImportant({
      backgroundColor: text.baseColor,
      boxShadow: 'none',
    }),
  },
});
