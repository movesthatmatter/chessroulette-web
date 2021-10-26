import { colors } from '../colors';
import { CustomTheme } from '..';
import { CSSProperties } from 'src/lib/jss';

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
    background: '#1C1C28',
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
      positive: 'linear-gradient(91.41deg, #1775CE 47.4%, #3BC0C8 97.79%)',
      attention: colors.dark.attention,
      secondary: 'linear-gradient(332deg, #ED65D4 6.21%, #1775CE 52.98%)',
      // secondary: 'linear-gradient(0deg, #6FCEBF 50%, #3C79E9 50%)',
      negative: 'linear-gradient(90.67deg, #CE186B 36.29%, #FB3B80 99.64%)',
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
