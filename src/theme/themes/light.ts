import hexToRgba from "hex-to-rgba";
import { CustomTheme, Theme } from "..";
import { colors } from "../colors";
import { deepMergeTheme, getBoxShadow } from "../util";
import { darkTheme } from "./dark";

const light : Theme = {
  colors: colors.light,
  text: {
    primaryColor :'#001B36',
    baseColor: '#25282B',
    disabledColor: '#A4A8B5',
    subtle: '#A4A8B5',
    family: 'Lato, Open Sans, sans-serif',
  },
  modal: {
    background: '#fff',
    boxShadow: '0 12px 26px rgba(16, 30, 115, 0.08)',
  },
  textInput: {
    border: '1px solid #DFE5EF',
    backgroundColor: colors.light.white,
    boxShadow : getBoxShadow(0, 12, 26, 0, hexToRgba(colors.light.negative, 0.08)),
    readOnly: {
      border: '1px solid #fff',
    }
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
  selectInput: {
    borderColor: colors.light.neutral,
    backgroundColor: colors.light.white,
    textColor: '#25282B',
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
  floatingShadow: {
    boxShadow: '0 12px 26px rgba(16, 30, 115, 0.08)',
  },
  borders: {
    border: `1px solid ${colors.light.neutral}`
  },
  depthBackground: {
    backgroundColor: colors.light.white
  },
  links: {
    hover: {
      borderBottom: `3px solid #001B36`,
      color: '#001B36',
    }
  }
};

export const lightTheme : CustomTheme = {
  ...deepMergeTheme(darkTheme, light),
  name: 'lightDefault'
}