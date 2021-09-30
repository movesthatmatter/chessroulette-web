import { dark, light } from './text';
import { colors } from './colors';
import { getBoxShadow } from './util';
import hexToRgba from 'hex-to-rgba';

export const lightTheme = {
  colors: colors.light,
  text: light,
  textInput: {
    border: '1px solid #DFE5EF',
    backgroundColor: colors.light.white,
    boxShadow : getBoxShadow(0, 12, 26, 0, hexToRgba(colors.light.negative, 0.08))
  },
  selectInput: {
    borderColor: colors.light.neutral,
    backgroundColor: colors.light.white,
    textColor: colors.light.text,
  },
  button: {
    backgrounds: {
      primary : colors.light.primary,
      secondary : colors.light.secondary,
      attention: colors.light.attention,
      positive: colors.light.positive,
      negative: colors.light.negative,
      neutral: colors.light.neutral,
    },
    color: colors.light.white,
    font: {
      weight: 600
    },
    iconWrapper: {
      primary: {
        boxShadow: `0 3px 6px 0 ${hexToRgba(colors.light.primary, 0.36)}`
      },
      secondary : {
        boxShadow: `0 3px 6px 0 ${hexToRgba(colors.light.secondary, 0.36)}`
      },
      positive: {
        boxShadow: `0 3px 6px 0 ${hexToRgba(colors.light.positive, 0.36)}`
      },
      negative: {
        boxShadow: `0 3px 6px 0 ${hexToRgba(colors.light.negative, 0.36)}`,
      },
      attention: {
        boxShadow: `0 3px 6px 0 ${hexToRgba(colors.light.attention, 0.36)}`
      }
    },
    effects: {
        primary : {
          boxShadow: getBoxShadow(0, 6, 12, 0, hexToRgba(colors.light.primary, 0.26)),
        },
        primaryClear: {
          boxShadow: getBoxShadow(0, 6, 12, 0, hexToRgba(colors.light.primary, 0.1)),
        },
        secondary: {
          boxShadow: getBoxShadow(0, 6, 12, 0, hexToRgba(colors.light.secondary, 0.26)),
        },
        secondaryClear: {
          boxShadow: getBoxShadow(0, 6, 12, 0, hexToRgba(colors.light.secondary, 0.16)),
        },
        attention: {
          boxShadow: getBoxShadow(0, 6, 12, 0, hexToRgba(colors.light.attention, 0.26)),
        },
        attentionClear: {
          boxShadow: getBoxShadow(0, 6, 12, 0, hexToRgba(colors.light.attention, 0.16)),
        },
        positive: {
          boxShadow: getBoxShadow(0, 6, 12, 0, hexToRgba(colors.light.positive, 0.26)),
        },
        positiveClear: {
          boxShadow: getBoxShadow(0, 6, 12, 0, hexToRgba(colors.light.positive, 0.16)),
        },
        negative: {
          boxShadow: getBoxShadow(0, 6, 12, 0, hexToRgba(colors.light.negative, 0.26)),
        },
        negativeClear: {
          boxShadow: getBoxShadow(0, 6, 12, 0, hexToRgba(colors.light.negative, 0.16)),
        },
        neutral: {
          boxShadow: getBoxShadow(0, 6, 12, 0, hexToRgba(colors.light.neutral, 0.26)),
        },
        neutralClear: {
          boxShadow: getBoxShadow(0, 6, 12, 0, hexToRgba(colors.light.neutral, 0.16)),
        }
    }
  }
};

export const darkTheme = {
  colors: colors.dark,
  text: dark,
  textInput: {
    border: '1px solid #5B196D',
    backgroundColor: '#21212B',
    boxShadow: ''
  },
  selectInput: {
    borderColor: '#5B196D',
    backgroundColor: '#21212B',
    textColor: '#a6a7a9'
  },
  button: {
    backgrounds: {
      primary : colors.dark.primary,
      secondary : colors.dark.primary,
      attention: colors.dark.attention,
      positive: 'linear-gradient(270deg, #D932D1 0%, #4F8FC7 100%)',
      negative: colors.dark.negative,
      neutral: colors.dark.neutral,
    },
    color: colors.dark.black,
    font: {
      weight: 400
    },
    iconWrapper: {
      primary: {
        boxShadow: ''
      },
      secondary: {
        boxShadow: ''
      },
      positive: {
        boxShadow: ''
      },
      negative: {
        boxShadow: ''
      },
      attention: {
        boxShadow: ''
      }
    },
    effects: {
        primary : {
          boxShadow: '',
        },
        primaryClear: {
          boxShadow: '',
        },
        secondary: {
          boxShadow: '',
        },
        secondaryClear: {
          boxShadow: '',
        },
        attention: {
          boxShadow: '',
        },
        attentionClear: {
          boxShadow: '',
        },
        positive: {
          boxShadow: '',
        },
        positiveClear: {
          boxShadow: '',
        },
        negative: {
          boxShadow: '',
        },
        negativeClear: {
          boxShadow: '',
        },
        neutral: {
          boxShadow: '',
        },
        neutralClear: {
          boxShadow: '',
        }
    }
  }
};

export type CustomTheme = typeof lightTheme;

// export * from './colors';
export * from './effects';
export * from './fonts';
// export * from './text';
export * from './mediaQueries';
