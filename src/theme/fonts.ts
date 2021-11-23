import { CSSProperties } from 'src/lib/jss/types';
import { onlyMobile } from './mediaQueries';

const small1: CSSProperties = {
  fontSize: '13px',
  fontWeight: 'normal',
  lineHeight: '16px',

  ...onlyMobile({
    fontSize: '11px',
    lineHeight: '14px',
  }),
};

const small2: CSSProperties = {
  fontSize: '12px',
  fontWeight: 'bold',
  lineHeight: '16px',

  ...onlyMobile({
    fontSize: '10px',
    lineHeight: '13px',
  }),
};

const small3: CSSProperties = {
  fontSize: '10px',
  fontWeight: 'bold',
  lineHeight: '12px',
};

const body1: CSSProperties = {
  fontSize: '16px',
  fontWeight: 'normal',
  lineHeight: '24px',

  ...onlyMobile({
    fontSize: '13px',
    lineHeight: '16px',
  }),
};

const body2: CSSProperties = {
  fontSize: '14px',
  fontWeight: 'normal',
  lineHeight: '20px',

  ...onlyMobile({
    fontSize: '11px',
    lineHeight: '12px',
  }),
};

const title1: CSSProperties = {
  fontSize: '36px',
  fontWeight: 700,
  lineHeight: '1em',

  ...onlyMobile({
    fontSize: '18px',
    lineHeight: '14px',
  }),
};

const title2: CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  lineHeight: '1em',

  ...onlyMobile({
    fontSize: '18px',
    lineHeight: '14px',
  }),
};

const subtitle1: CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  lineHeight: '24px',

  ...onlyMobile({
    fontSize: '13px',
    lineHeight: '16px',
  }),
};

const subtitle2: CSSProperties = {
  fontSize: '14px',
  fontWeight: 700,
  lineHeight: '20px',

  ...onlyMobile({
    fontSize: '11px',
    lineHeight: '13px',
  }),
};

const largeNormal: CSSProperties = {
  fontSize: '18px',
  fontWeight: 'normal',
  lineHeight: '26px',
};

const largeBold: CSSProperties = {
  fontSize: '18px',
  fontWeight: 'bolder',
  lineHeight: '26px',
};

const hugeNormal: CSSProperties = {
  fontSize: '32px',
  lineHeight: '32px',
};

const hugeBold: CSSProperties = {
  fontSize: '32px',
  lineHeight: '32px',
  fontWeight: 'bold',
};

export const fonts = {
  small1,
  small2,
  small3,

  body1,
  body2,

  title1,
  title2,

  subtitle1,
  subtitle2,

  largeBold,
  largeNormal,

  hugeBold,
  hugeNormal,
};
