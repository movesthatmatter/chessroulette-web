import { createUseStyles as createUseStylesJSS, DefaultTheme, useTheme } from 'react-jss';
import { Classes, Styles } from 'jss';
import { CSSProperties } from './types';
import { CustomTheme } from 'src/theme';

// Add stricter types for this function
export function createUseStyles<Theme = CustomTheme, C extends string = string>(
  styles: Record<C, CSSProperties> | ((theme: Theme) => Record<C, unknown>),
  options?: {}
): () => Classes<C> {
  const hook = createUseStylesJSS(styles as Styles<C> | ((theme: Theme) => Styles<C>), options);

  return (dataProps?: Record<string, unknown>) => {
    const theme = useTheme();

    return hook({ theme, ...dataProps }) as Classes<C>;
  };
}
