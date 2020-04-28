import { createUseStyles as createUseStylesJSS, DefaultTheme } from 'react-jss';
import * as css from 'csstype';

// Add stricter types for this function
// export const createUseStyles = <TStyle extends { [p: string]: css.Properties }>(
//   styles: { [p: string]: css.Properties },
// ) => createUseStylesJSS<TStyle>(styles) as unknown as () => {[k in keyof TStyle]: string };

// type Style<C extends string> = { [p: keyof C]: css.Properties };

export function createUseStyles<Theme = DefaultTheme, C extends string = string>(
  styles: Record<C, css.Properties> | ((theme: Theme) => Record<C, unknown>),
  options?: {},
) {
  return createUseStylesJSS(styles, options);
}
