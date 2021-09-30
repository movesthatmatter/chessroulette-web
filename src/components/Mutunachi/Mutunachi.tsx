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
import m12 from './assets/mutunachi_12.png';
import m13 from './assets/mutunachi_13.png';
import m14 from './assets/mutunachi_14.png';
import m15 from './assets/mutunachi_15.png';
import m16 from './assets/mutunachi_16.png';
import m17 from './assets/mutunachi_17.png';
import m18 from './assets/mutunachi_18.png';
import m19 from './assets/mutunachi_19.png';

import m20 from './assets/mutunachi_20.png';
import m21 from './assets/mutunachi_21.png';
import m22 from './assets/mutunachi_22.png';
import m23 from './assets/mutunachi_23.png';
import m24 from './assets/mutunachi_24.png';
import m25 from './assets/mutunachi_25.png';
import m26 from './assets/mutunachi_26.png';
import m27 from './assets/mutunachi_27.png';

import mw1 from './assets/mutunachi_white_1.png';
import mw2 from './assets/mutunachi_white_2.png';
import mw3 from './assets/mutunachi_white_3.png';
import mw4 from './assets/mutunachi_white_4.png';
import mw5 from './assets/mutunachi_white_5.png';
import mw6 from './assets/mutunachi_white_6.png';
import mw7 from './assets/mutunachi_white_7.png';
import mw8 from './assets/mutunachi_white_8.png';
import mw9 from './assets/mutunachi_white_9.png';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';

const map: { [k: string]: unknown } = {
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
  '19': m19,

  '20': m20,
  '21': m21,
  '22': m22,
  '23': m23,
  '24': m24,
  '25': m25,
  '26': m26,
  '27': m27,
};

const mapWhite: { [k: string]: unknown } = {
  '0': mw1,
  '1': mw2,
  '2': mw3,
  '3': mw4,
  '4': mw5,
  '5': mw6,
  '6': mw7,
  '7': mw8,
  '8': mw9,
  '9': mw1,
  '10': mw2,
  '11': mw3,
  '12': mw4,
  '13': mw5,
  '14': mw6,
  '15': mw7,
  '16': mw8,
  '17': mw9,
  '18': mw1,
  '19': mw2,
  '20': mw3,
  '21': mw4,
  '22': mw5,
  '23': mw6,
  '24': mw7,
  '25': mw8,
  '26': mw9,
  '27': mw2,
};

export type MutunachiProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> &
  (
    | {
        mid: keyof typeof map;
        random?: never;
      }
    | {
        mid?: never;
        random: true;
      }
  ) & {
    avatar? : boolean;
  };

export const Mutunachi: React.FC<MutunachiProps> = ({ mid, className, random, avatar, ...imgProps }) => {
  const cls = useStyles();
  const { themeName } = useColorTheme();
  const src = avatar ? 
    (mid ? map[mid] : map[String(getRandomInt(0,18))])
    : mid
    ? themeName === 'light'
      ? map[mid]
      : mapWhite[mid]
    : themeName === 'light'
    ? map[String(getRandomInt(0, 18))]
    : mapWhite[String(getRandomInt(0, 18))];

  return (
    <img className={cx(cls.img, className)} src={src as string} alt="Mutunachi" {...imgProps} />
  );
};

const useStyles = createUseStyles({
  img: {
    objectFit: 'contain',
    width: '100%',
    display: 'block',
  },
});
