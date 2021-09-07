import React, { useMemo } from 'react';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import logoLight from './assets/Logo_light_full.svg';
import logoDark from './assets/Logo_dark_full.svg';
import logoLightSingle from './assets/Logo_light_single.svg';
import logoDarkSingle from './assets/Logo_dark_single.svg';
import logoDarkSingleStroke from './assets/Logo_dark_single_stroke_variation.svg';
import { onlyMobile, text } from 'src/theme';
import { Badge } from '../Badge';
import cx from 'classnames';
import { Link } from 'react-router-dom';

type Props = {
  asLink?: boolean;
  darkMode?: boolean;
  withBeta?: boolean;
  withOutline?: boolean;
  mini?: boolean;
  className?: string;
  imgClassName?: string;
  width?: string;
};

export const Logo: React.FC<Props> = ({
  asLink = true,
  withBeta = false,
  mini = false,
  darkMode = false,
  withOutline = false,
  className,
  imgClassName,
}) => {
  const cls = useStyles();

  const imgSrc = useMemo(() => {
    if (mini) {
      if (!darkMode && withOutline) {
        return logoDarkSingleStroke;
      }

      return darkMode ? logoLightSingle : logoDarkSingle;
    }

    return darkMode ? logoLight : logoDark;
  }, [mini, darkMode, withOutline]);

  const content = (
    <div
      className={cx(cls.container, mini && cls.miniContainer, className)}
      // style={{
      //   width: width,
      // }}
    >
      <img src={imgSrc} alt="Chessroulette Logo" className={cx(cls.img, imgClassName)} />
      {withBeta && !mini && (
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
      )}
    </div>
  );

  return asLink ? <Link to="/">{content}</Link> : content;
};

const useStyles = createUseStyles({
  container: {
    position: 'relative',
    display: 'block',
    width: '220px',

    ...onlyMobile({
      width: '100%',
      maxWidth: '140px',
      minWidth: '100px',
    }),
  },
  miniContainer: {
    width: '50px',
  },
  img: {
    width: '100%',
  },
  badge: {
    position: 'absolute',
    transform: 'translateX(-16px) translateY(-1px)',
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
      backgroundColor: '#FF32A1',
      boxShadow: 'none',
    }),
  },
});
