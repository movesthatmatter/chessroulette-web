import { CSSProperties } from 'src/lib/jss/types';
import { colors } from './colors';

export const floatingShadow: CSSProperties = {
  boxShadow: '0 12px 26px rgba(16, 30, 115, 0.08)',
};

export const hardFloatingShadow: CSSProperties = {
  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.15)',
};

export const floatingShadowDarkMode: CSSProperties = {
  boxShadow: '0 12px 26px rgba(0, 0, 0)',
};

export const softFloatingShadowDarkMode: CSSProperties = {
  boxShadow: '0 12px 26px rgba(0, 0, 0, .3)',
};

export const textShadowDarkMode: CSSProperties = {
  textShadow: '0 0 8px black',
};

export const softBorderRadius: CSSProperties = {
  borderRadius: '8px',
};

export const hardBorderRadius: CSSProperties = {
  borderRadius: '16px',
};

export const borderRadius: CSSProperties = {
  borderRadius: '16px',
};

export const softOutline: CSSProperties = {
  border: `1px solid ${colors.light.neutral}`,
};

export const effects = {
  // TODO: Refactor all of these
  borderRadius,
  hardBorderRadius,
  softBorderRadius,
  floatingShadow,
  hardFloatingShadow,
  floatingShadowDarkMode,
  softFloatingShadowDarkMode,
  softOutline,
  textShadowDarkMode,
};
