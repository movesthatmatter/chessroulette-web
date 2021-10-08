const dark = {
  primary: '#CE186B',
  primaryHover: '#D427A8',
  primaryLight: '#E34E89',
  primaryLightest: '#F545A2',
  primaryDark: '#CF1484',

  chessBoardDark: '#7e9ac7',
  chessBoardLight: '#dee5f0',

  attention: '#FF9416',
  attentionLight: '#F59C70',
  attentionDarker: '#E67811',

  negative: '#BD3030',
  negativeLight: '#D05252',
  negativeLighter: '#FB76A1',
  negativeLightest: '#E485BF',
  negativeDarker: '#A81919',

  positive: '#518EC7',
  positiveLight: '#3FCEE1',
  positiveDarker: '#63BFE2',

  black: '#F2F2F2',
  white: '#161626',

  neutral: '#DFE5EF',
  neutralLight: '#212036',
  neutralLighter: '#17181F',
  neutralLightest: '#161618',
  neutralDarker: '#E2E8F0',
  neutralDarkest: '#DBDDE0',
  neutralDark: '#2D3247',

  secondary: '#E34E89',
  secondaryLight: '#FCBFD5',
  secondaryDark: '#D13D6C',

  background: '#161A2B',
};

const light = {
  primary: '#5A20FE',
  primaryHover: '#74A3FE',
  primaryLight: '#A9C1FD',
  primaryLightest: '#EBF0FF',
  primaryDark: '#366BEF',

  chessBoardDark: '#7e9ac7',
  chessBoardLight: '#dee5f0',

  attention: '#FAC032',
  attentionLight: '#FCDF98',
  attentionDarker: '#EFAD0A',

  negative: '#FF6760',
  negativeLight: '#FF7E77',
  negativeLighter: '#FFADA9',
  negativeLightest: '#FFD5D2',
  negativeDarker: '#E74F48',

  positive: '#16D090',
  positiveLight: '#34EEAE',
  positiveDarker: '#03B575',

  white: '#fff',
  black: '#25282B',

  neutral: '#DFE5EF',
  neutralLight: '#DBDDE0',
  neutralLighter: '#E6ECF5',
  neutralLightest: '#F6F8FB',
  neutralDark: '#CACCCF',
  neutralDarker: '#A0A4A8',
  neutralDarkest: '#52575C',

  secondary: '#DFE5EF',
  secondaryLight: '#DBDDE0',
  secondaryDark: '#CACCCF',

  background: '#F6F8FB',
};

export type ColorPalette = keyof typeof light;
export type Colors = {
  [k in ColorPalette]: string;
};

export const colors = {
  light,
  dark,
};
