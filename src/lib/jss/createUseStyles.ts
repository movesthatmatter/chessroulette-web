import { createUseStyles as createUseStylesJSS, DefaultTheme } from 'react-jss';
import { CSSProperties } from './types';

// Add stricter types for this function
export function createUseStyles<Theme = DefaultTheme, C extends string = string>(
  styles: Record<C, CSSProperties> | ((theme: Theme) => Record<C, unknown>),
  options?: {},
) {
  return createUseStylesJSS(styles, options);
}
