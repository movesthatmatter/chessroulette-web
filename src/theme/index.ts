import { dark, light } from './text';
import { colors } from './colors';
import { getBoxShadow } from './util';
import hexToRgba from 'hex-to-rgba';
import { effects, floatingShadow } from './effects';
import blueBoard from 'src/modules/Games/Chess/components/ChessBoard/assets/board/blue.svg';
import darkBoard from 'src/modules/Games/Chess/components/ChessBoard/assets/board/blue_darkMode.svg';
import {light as lightPieces, dark as darkPieces} from 'src/modules/Games/Chess/components/ChessBoard/assets/pieces/index';

export const lightTheme = {
  colors: colors.light,
  text: light,
  textInput: {
    border: '1px solid #DFE5EF',
    backgroundColor: colors.light.white,
    boxShadow : getBoxShadow(0, 12, 26, 0, hexToRgba(colors.light.negative, 0.08))
  },
  textArea: {
    backgroundColor: colors.light.white,
    border: {
      borderStyle: 'solid',
      borderColor: colors.light.neutral,
      borderWidth: 0,
    },
    boxShadow : getBoxShadow(0, 12, 26, 0, hexToRgba(colors.light.negative, 0.08))
  },
  lines: {
    color: colors.light.neutral,
  },
  mutunachi: {
    containerColor: `linear-gradient(top, ${colors.light.primaryLight} 100%, #fff 0%)`
  },
  selectInput: {
    borderColor: colors.light.neutral,
    backgroundColor: colors.light.white,
    textColor: colors.light.text,
    focused: '#DEEBFF',
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
    disabledColor: colors.light.white,
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
    icon: {
      color: colors.light.white,
      borderColor: colors.light.neutral,
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
  },
  board: {
    image : blueBoard,
    pieces: lightPieces,
    selectedSquare: '#14551e80',
    lastMove: '#9bc70069'
  },
  chat: {
    messageBackground: colors.light.neutral,
    myMessageColor : '#001b36',
  },
  flatingBox: {
    backgroundColor: colors.light.white,
    ...effects.softOutline,
    ...floatingShadow,
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
  textArea: {
    backgroundColor: '#21212B',
    border: {
      borderStyle: 'solid',
      borderColor: 'rgba(0,0,0,0)',
      borderWidth: 0,
    },
    boxShadow: ''
  },
  selectInput: {
    borderColor: '#5B196D',
    backgroundColor: '#21212B',
    textColor: '#a6a7a9',
    focused: '#518EC7',
  },
  mutunachi: {
    containerColor: '#7774CA'
  },
  lines: {
    color: colors.dark.primary,
  },
  button: {
    backgrounds: {
      primary : colors.dark.primary,
      secondary : 'linear-gradient(270deg, #D527A7 0%, #B515DD 100%)',
      attention: colors.dark.attention,
      positive: 'linear-gradient(270deg, #D932D1 0%, #4F8FC7 100%)',
      negative: colors.dark.negative,
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
  board: {
    image : darkBoard,
    pieces: darkPieces,
    selectedSquare: '#55145380',
    lastMove: '#2e0c2d80'
  },
  chat: {
    messageBackground: 'linear-gradient(270deg, #1977F2 0%, #43D1BE 100%)',
    myMessageColor: colors.dark.white
  },
  flatingBox: {
    backgroundColor: '#21212B',
    border: '',
    boxShadow: ''
  }
};

export type CustomTheme = typeof lightTheme;

// export * from './colors';
export * from './effects';
export * from './fonts';
// export * from './text';
export * from './mediaQueries';
