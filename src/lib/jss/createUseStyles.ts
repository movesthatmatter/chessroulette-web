import { createUseStyles as createUseStylesJSS, DefaultTheme, useTheme } from 'react-jss';
import {
  Styles,
} from 'jss';
import { CSSProperties } from './types';

// Add stricter types for this function
export function createUseStyles<Theme = DefaultTheme, C extends string = string>(
  styles: Record<C, CSSProperties> | ((theme: Theme) => Record<C, unknown>),
  options?: {}
) {
  const hook = createUseStylesJSS(styles as Styles<C> | ((theme: Theme) => Styles<C>), options);

  return (dataProps?: Record<string, unknown>) => {
    const theme = useTheme();

    return hook({ theme, ...dataProps });
  };
}
