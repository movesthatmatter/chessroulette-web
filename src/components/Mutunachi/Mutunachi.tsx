import React from 'react';
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
import m11 from './assets/Group 20.png';
import m12 from './assets/mutunachi_ice_cream_and_baloons.png';

const map = {
  0: m0,
  1: m1,
  2: m2,
  3: m3,
  4: m4,
  5: m5,
  6: m6,
  7: m7,
  8: m8,
  9: m9,
  10: m10,
  11: m11,
  12: m12,
};

export type MutunachiProps = React.DetailedHTMLProps<
React.ImgHTMLAttributes<HTMLImageElement>,
HTMLImageElement
> & {
  mid: keyof typeof map;
};

export const Mutunachi: React.FC<MutunachiProps> = ({
  mid, className, style, height, ...imgProps
}) => (
  <div className={className} style={style}>
    <img
      src={map[mid]}
      alt="Mutunachi"
      {...imgProps}
      style={{
        height: height ? `${height}` : '100%',
        objectFit: 'contain',
      }}
    />
  </div>
);
