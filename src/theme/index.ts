import { dark, light } from './text';
import { colors } from './colors';

// const customTheme: ThemeType = {
//   global: {
//     colors: {
//       brand: 'rgb(84, 196, 242)',
//       text: {
//         dark: '#f8f8f8',
//         light: text.primaryColor,
//       },
//     },
//     font: {
//       family: 'Lato, Open Sans, sans-serif',
//     },
//   },
//   button: {
//     default: {
//       color: 'brand',
//       border: {
//         color: 'brand',
//         width: '2px',
//       },
//     },
//     primary: {
//       background: { color: 'brand' },
//       color: 'light-1',
//     },
//     secondary: {
//       border: { color: 'brand', width: '2px' },
//     },
//     active: {
//       background: { color: 'brand-contrast' },
//     },
//   },
// };


export const lightTheme = {
  colors: colors.light,
  text: light,
};

export const darkTheme = {
  colors: colors.dark,
  text: dark
};

export type CustomTheme = typeof lightTheme;

// export * from './colors';
export * from './effects';
export * from './fonts';
// export * from './text';
export * from './mediaQueries';
