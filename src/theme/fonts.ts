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
};

const body2: CSSProperties = {
  fontSize: '14px',
  fontWeight: 'normal',
  lineHeight: '20px',
};

const subtitle1: CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  lineHeight: '24px',

  ...onlyMobile({
    fontSize: '13px',
    lineHeight: '16px',
  })
};

const subtitle2: CSSProperties = {
  fontSize: '14px',
  fontWeight: 700,
  lineHeight: '20px',
};

export const fonts = {
  small1,
  small2,
  small3,

  body1,
  body2,

  subtitle1,
  subtitle2,
};
