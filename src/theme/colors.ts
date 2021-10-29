const dark = {
  primary: '#CE186B',
  primaryLight: '#D82E7B',
  primaryLighter: '#DB5087',
  primaryLightest: '#E1639C',
  primaryDark: '#BB0D5C',
  primaryDarker: '#980548',
  primaryDarkest: '#73034D',
  primaryHover: '#3BC0C8',

  attention: '#FF9416',
  attentionLight: '#F59C70',
  attentionDarker: '#E67811',

  negative: '#BD3030',
  negativeLight: '#D61D1D',
  negativeLighter: '#F05858',
  negativeLightest: '#F47575',
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

  secondary: '#8354E9',
  secondaryLight: '#AC4ABC',
  secondaryDark: '#6C21DF',

  background: '#161A2B',
};

const light = {
  primary: '#5A20FE',
  primaryLight: '#A383FF',
  primaryLighter: '#BFA8FF',
  primaryLightest: '#E7DFFF',
  primaryDark: '#410ED1',
  primaryDarker: '#2E0899',
  primaryDarkest: '#210A64',
  primaryHover: '#7645FF',

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

export type ColorPalette = keyof (typeof light | typeof dark);
export type Colors = {
  [k in ColorPalette]: string;
};

export const colors = {
  light,
  dark,
  universal: {
    black: '#000',
    white: '#fff',
  },
};
