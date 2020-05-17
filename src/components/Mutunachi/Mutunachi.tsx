/* eslint-disable quote-props */
import React, { useRef } from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';

import { getRandomInt } from 'src/lib/util';
import m0 from './assets/mutunachi_0.png';
import m1 from './assets/mutunachi_1.png';
import m2 from './assets/mutunachi_2.png';
import m3 from './assets/mutunachi_3.png';
import m4 from './assets/mutunachi_4.png';
import m5 from './assets/mutunachi_5.png';
import m6 from './assets/mutunachi_6.png';
import m7 from './assets/mutunachi_7.png';
import m8 from './assets/mutunachi_8.png';
import m9 from './assets/mutunachi_9.png';
import m10 from './assets/mutunachi_10.png';
import m11 from './assets/mutunachi_11.png';
import m12 from './assets/mutunachi_ice_cream_and_baloons.png';
import m13 from './assets/mutunachi_13.png';
import m14 from './assets/mutunachi_14.png';
import m15 from './assets/mutunachi_15.png';
import m16 from './assets/mutunachi_16.png';
import m17 from './assets/mutunachi_17.png';
import m18 from './assets/mutunachi_18.png';

const map: {[k: string]: unknown} = {
  '0': m0,
  '1': m1,
  '2': m2,
  '3': m3,
  '4': m4,
  '5': m5,
  '6': m6,
  '7': m7,
  '8': m8,
  '9': m9,
  '10': m10,
  '11': m11,
  '12': m12,
  '13': m13,
  '14': m14,
  '15': m15,
  '16': m16,
  '17': m17,
  '18': m18,
};

export type MutunachiProps = React.DetailedHTMLProps<
React.ImgHTMLAttributes<HTMLImageElement>,
HTMLImageElement
> & ({
  mid: keyof typeof map;
  random?: never;
} | {
  mid?: never;
  random: true;
});

export const Mutunachi: React.FC<MutunachiProps> = ({
  mid,
  className,
  ...imgProps
}) => {
  const cls = useStyles();
  const randomId = useRef(String(getRandomInt(0, 18))).current;

  return (
    <img
      className={cx(cls.img, className)}
      src={((mid && map[mid]) || map[randomId]) as string}
      alt="Mutunachi"
      {...imgProps}
    />
  );
};

const useStyles = createUseStyles({
  img: {
    objectFit: 'contain',
    width: '100%',
    display: 'block',
  },
});
