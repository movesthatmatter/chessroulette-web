import { colors } from '../colors';
import { CustomTheme } from '..';
import { CSSProperties } from 'src/lib/jss';
import { effects } from '../effects';

export const defaultThemeDark = {
  colors: colors.dark,
  text: {
    baseColor: '#E2E8F0',
    primaryColor: '#cacacb',
    disabledColor: '#A4A8B5',
    subtle: '#787878',
    family: 'Lato, Open Sans, sans-serif',
  },
  textInput: {
    border: '1px solid #5B196D',
    backgroundColor: '#21212B',
    boxShadow: '',
    readOnly: {
      border: '1px solid #1B1C30',
    },
  },
  textArea: {
    backgroundColor: '#21212B',
    border: {
      borderStyle: 'solid',
      borderColor: 'rgba(0,0,0,0)',
      borderWidth: 0,
    } as CSSProperties,
    boxShadow: '',
  },
  modal: {
    background: '#161A2B',
    boxShadow: '0 12px 26px rgba(0, 0, 0)'
  },
  selectInput: {
    borderColor: '#5B196D',
    backgroundColor: '#21212B',
    textColor: '#a6a7a9',
    focused: '#518EC7',
  },
  lines: {
    color: '#29283a',
  },
  button: {
    backgrounds: {
      primary: 'linear-gradient(89.89deg, #B515DE 1.74%, #D528A6 82.04%)',
      positive: 'linear-gradient(94.11deg, #31BA99 23.11%, #15765F 101.1%)',
      attention: colors.dark.attention,
      negative: 'linear-gradient(90.67deg, #CE186B 36.29%, #FB3B80 99.64%)',
      // For now secondary takes the role of not important (neutral)
      //  since it's currenlty in line with how the light theme works
      //  but I think there's need in the future to make it more "pop-y", in the same
      //  vein as the primary (just not as much), and introduce a "neutral" button
      //  type to take the palce of the current secondary!
      secondary: '#423868',
      neutral: '##DBDDE0',
    },
    icon: {
      color: colors.dark.black,
      borderColor: colors.dark.primary,
    },
    disabledColor: '#343434',
    color: colors.dark.black,
    font: {
      weight: 600,
    },
    iconWrapper: {
      primary: {
        boxShadow: '',
      },
      secondary: {
        boxShadow: '',
      },
      positive: {
        boxShadow: '',
      },
      negative: {
        boxShadow: '',
      },
      attention: {
        boxShadow: '',
      },
    },
    effects: {
      primary: {
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
      },
    },
  },
  borders: {
    border: 'none',
  },
  depthBackground: {
    backgroundColor: colors.dark.white,
  },
  floatingShadow: {
    boxShadow: '',
  },
  links: {
    hover: {
      color: colors.dark.primary,
      borderBottom: 'none',
    },
  },
};

export const darkTheme: CustomTheme = {
  ...defaultThemeDark,
  name: 'darkDefault',
};
