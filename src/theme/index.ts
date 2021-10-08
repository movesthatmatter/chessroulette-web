import { Colors} from './colors';
import { defaultThemeDark, darkTheme as darkDefault } from './themes/dark';
import { lightTheme as lightDefault} from './themes/light';

export const themes = { 
  lightDefault,
  darkDefault
}
// type ThemeWithoutName = Omit<typeof darkDefault,'name'>;
export type DefaultTheme =  typeof defaultThemeDark & {
  name: 'darkDefault' | 'lightDefault';
};

export type CustomTheme = DefaultTheme

type PartialProps<T extends Omit<typeof defaultThemeDark, 'colors'>> = {
  [k in keyof T] : Partial<T[k]>
}

export type Theme = {
  colors : Colors
} 
& PartialProps<Omit<typeof defaultThemeDark,'colors'>>

export * from './effects';
export * from './fonts';
export * from './mediaQueries';
