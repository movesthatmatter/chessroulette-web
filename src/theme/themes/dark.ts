import { colors } from "../colors";
import { CustomTheme } from "..";

export const defaultThemeDark = {
  colors: colors.dark,
  text: {
    baseColor :'#E2E8F0',
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
      border: '1px solid #1B1C30'
    }
  },
  textArea: {
    backgroundColor: '#21212B',
    border: {
      borderStyle: 'solid',
      borderColor: 'rgba(0,0,0,0)',
      borderWidth: 0,
    },
    boxShadow: ''
  },
  modal: {
    background: '#1C1C28'
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
      primary : colors.dark.primary,
      secondary: 'linear-gradient(270deg, #D932D1 0%, #4F8FC7 100%)',
      attention: colors.dark.attention,
      positive : 'linear-gradient(270deg, #D527A7 0%, #B515DD 100%)',
      negative: colors.dark.negativeLightest,
      neutral: '##DBDDE0',
    },
    icon: {
      color: colors.dark.black,
      borderColor: colors.dark.primary
    },
    disabledColor: '#343434',
    color: colors.dark.black,
    font: {
      weight: 600
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
  },
  borders: {
    border: 'none'
  },
  depthBackground: {
    backgroundColor: colors.dark.white
  },
  floatingShadow: {
    boxShadow: ''
  },
  links: {
    hover: {
      color: colors.dark.primary,
      borderBottom: 'none'
    }
  }
};

export const darkTheme: CustomTheme = {
  ...defaultThemeDark,
  name: 'darkDefault'
}