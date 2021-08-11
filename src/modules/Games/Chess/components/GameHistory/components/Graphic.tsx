import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { colors, softBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import cx from 'classnames';
import { console } from 'window-or-global';
import { getColor } from './util';

type Props = {
  homePercent: number; // A value from 0 to 1
};

export const Graphic: React.FC<Props> = ({ homePercent }) => {
  const cls = useStyles();

  const bottomPercentage = Math.floor(homePercent * 100);
  const topPercentage = 100 - bottomPercentage;

  const [topColor, setTopColor] = useState(
    getColor(colors.negativeLighter, colors.negativeDarker, 0, 100, topPercentage)
  );
  const [bottomColor, setBottomColor] = useState(
    getColor(colors.primaryLight, colors.primaryDark, 0, 100, bottomPercentage)
  );

  useEffect(() => {
    setTopColor(getColor(colors.negativeLighter, colors.negativeDarker, 0, 100, topPercentage));
    setBottomColor(getColor(colors.primaryLight, colors.primaryDark, 0, 100, bottomPercentage));
  }, [homePercent]);

  return (
    <div className={cls.container}>
      <div
        className={cx(cls.line, cls.top)}
        style={{
          height: `${topPercentage}%`,
          background: `linear-gradient(${colors.negativeLighter}, ${topColor})`,
        }}
      />
      {homePercent > 0 && homePercent < 1 && <div className={cls.spacer} />}
      <div
        className={cx(cls.line, cls.bottom)}
        style={{
          height: `${bottomPercentage}%`,
          background: `linear-gradient(${bottomColor}, ${colors.primaryLight})`,
        }}
      />
    </div>
  );
};

const WIDTH = spacers.small;
const SPACER_HEIGHT_PX = spacers.smallPx;

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    height: '100%',
    width: WIDTH,
    marginLeft: `${SPACER_HEIGHT_PX}px`,
    // ...softBorderRadius,
    // background: 'red',
    // backgroundImage: 'linearGradient(to bottom, )',
    // background: `linear-gradient(${colors.negativeLight}, ${colors.primary})`,
    // opacity: .7,
    flexDirection: 'column',
  },
  spacer: {
    height: `${SPACER_HEIGHT_PX}px`,
  },
  line: {
    ...softBorderRadius,

    transition: 'all 250ms linear',
  },
  top: {
    width: '100%',
  },
  bottom: {
    width: '100%',
  },
});
