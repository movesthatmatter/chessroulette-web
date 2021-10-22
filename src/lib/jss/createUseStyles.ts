import { createUseStyles as createUseStylesJSS } from 'react-jss';
import { Classes, Styles } from 'jss';
import { CSSProperties } from './types';
import { CustomTheme } from 'src/theme';

// Add stricter types for this function
export function createUseStyles<Theme extends CustomTheme, C extends string = string>(
  styles: Record<C, CSSProperties> | ((theme: Theme) => Record<C, CSSProperties>),
  options?: {}
): () => Classes<C> {
  return createUseStylesJSS(styles as Styles<C> | ((theme: Theme) => Styles<C>), options);
}
