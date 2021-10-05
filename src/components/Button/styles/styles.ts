import { CSSProperties } from 'src/lib/jss/types';
import { borderRadius, CustomTheme, onlyMobile } from 'src/theme';
import { buttonEffects } from './effects';
import { makeImportant } from 'src/lib/jss';

const button = (theme: CustomTheme): CSSProperties => ({
  cursor: 'pointer',
  width: 'auto',
  border: 0,
  padding: 0,
  margin: 0,
  marginBottom: '16px',

  height: '32px',
  lineHeight: '32px',

  '&:hover': {
    opacity: '.8',
  },
  color: theme.button.color,
  ...{
    '&:disabled&:hover': {
      opacity: '1 !important',
      color: theme.button.disabledColor,
    },
  } as CSSProperties,

  '&:focus': {
    outline: 'none',
  },

  display: 'flex',
  flexDirection: 'row',

  ...borderRadius,
  ...{
    ...buttonEffects(theme).onClickTransition,
    '&:disabled': {
      background: theme.button.backgrounds.neutral,
      color: theme.button.disabledColor,
      ...buttonEffects(theme).onClickTransition['&:disabled'],
    },
  },

  ...onlyMobile({
    ...makeImportant({
      height: '28px',
      lineHeight: '28px',
      marginBottom: '13px',
    }),
  }),
});

const iconButton = (theme: CustomTheme): CSSProperties => ({
  '&:disabled': {
    ...{
      '&$clear$iconButton $icon': {
        fill: `${theme.colors.neutral} !important`,
        stroke: `${theme.colors.neutral} !important`,
        color: `${theme.colors.neutral} !important`,
      },
    } as CSSProperties['nestedKey'],
  },
});

const clear = (theme: CustomTheme): CSSProperties => ({
  borderWidth: '1px !important',
  borderStyle: 'solid !important',
  borderColor: theme.colors.neutral,

  background: 'transparent !important',

  ...({
    '& $label': {
      color: `${theme.colors.neutralDarkest} !important`,
      // fontWeight: 200,
      lineHeight: '30px',

      ...onlyMobile({
        ...makeImportant({
          lineHeight: '26px',
        }),
      }),
    },
    '& $iconWrapper': {
      height: '29px',

      ...onlyMobile({
        ...makeImportant({
          height: '29px',
        }),
      }),
    },
    '& $icon': {
      // color: `${colors.black} !important`,
      fill: `${theme.colors.black} !important`,
      stroke: `${theme.colors.black} !important`,
      color: `${theme.colors.black} !important`,
    },
  } as CSSProperties['nestedKey']),
});

const hasLoader: CSSProperties = {
  position: 'relative',
  cursor: 'auto',
};

const full: CSSProperties = {
  ...makeImportant({
    width: '100%',
    flex: 1,
    textAlign: 'center',
  }),
};

const primary = (theme: CustomTheme): CSSProperties => ({
  background: theme.button.backgrounds.primary,
  ...buttonEffects(theme).primaryButtonShadow,
  color:theme.button.color,
  '&:active': {
    ...({
      '& $iconWrapper': {
        boxShadow: theme.button.iconWrapper.primary.boxShadow,
      },
    } as CSSProperties['nestedKey']),
  },

  ...({
    '&$clear': {
      borderColor: `${theme.colors.primary} !important`,
      ...buttonEffects(theme).primaryClearButtonShadow,
    },
    '&$clear$hasLoader $loader > div': {
      backgroundColor: `${theme.colors.primary} !important`,
    },
    '&$clear$iconButton $icon': {
      fill: `${theme.colors.primary} !important`,
      stroke: `${theme.colors.primary} !important`,
      color: `${theme.colors.primary} !important`,
    },
    '&$clear$iconButton$hasLoader $loader > div': {
      backgroundColor: `transparent !important`,
      borderColor: `${theme.colors.primary} !important`,
      borderBottomColor: `transparent !important`,
    },
  } as CSSProperties['nestedKey']),
});

const secondary = (theme: CustomTheme): CSSProperties => ({
  background: theme.button.backgrounds.secondary,
  ...buttonEffects(theme).secondaryButtonShadow,
  color:theme.button.color,
  '&:active': {
    ...({
      '& $iconWrapper': {
        boxShadow: theme.button.iconWrapper.secondary.boxShadow,
      },
    } as CSSProperties['nestedKey']),
  },

  ...({
    '&$clear': {
      borderColor: `${theme.colors.secondary} !important`,
      ...buttonEffects(theme).secondaryClearButtonShadow,
    },
    '&$clear$hasLoader $loader > div': {
      backgroundColor: `${theme.colors.secondary} !important`,
    },
    '&$clear$iconButton $icon': {
      fill: `${theme.colors.secondary} !important`,
      stroke: `${theme.colors.secondary} !important`,
      color: `${theme.colors.secondary} !important`,
    },
    '&$clear$iconButton$hasLoader $loader > div': {
      backgroundColor: `transparent !important`,
      borderColor: `${theme.colors.secondary} !important`,
      borderBottomColor: `transparent !important`,
    },
    '& $icon': {
      fill: `${theme.colors.neutralDarkest} !important`,
      stroke: `${theme.colors.neutralDarkest} !important`,
      color: `${theme.colors.neutralDarkest} !important`,
    },
    '& $label': {
      color: theme.colors.neutralDarkest,
    },
  } as CSSProperties['nestedKey']),
});

const positive = (theme: CustomTheme): CSSProperties => ({
  background: theme.button.backgrounds.positive,
  color:theme.button.color,
  ...buttonEffects(theme).positiveButtonShadow,

  '&:active': {
    ...({
      '& $iconWrapper': {
        boxShadow: theme.button.iconWrapper.positive.boxShadow,
      },
    } as CSSProperties['nestedKey']),
  },

  ...({
    '&$clear': {
      borderColor: `${theme.colors.positive} !important`,
      ...buttonEffects(theme).positiveClearButtonShadow,
    },
    '&$clear$iconButton $icon': {
      fill: `${theme.colors.positive} !important`,
      stroke: `${theme.colors.positive} !important`,
      color: `${theme.colors.positive} !important`,
    },
    '&$clear$iconButton$hasLoader $loader > div': {
      backgroundColor: `transparent !important`,
      borderColor: `${theme.colors.positive} !important`,
      borderBottomColor: `transparent !important`,
    },
    '&$clear$hasLoader $loader > div': {
      backgroundColor: `${theme.colors.positive} !important`,
    },
  } as CSSProperties['nestedKey']),
});

const negative = (theme: CustomTheme): CSSProperties => ({
  background: theme.button.backgrounds.negative,
  ...buttonEffects(theme).negativeButtonShadow,
  color:theme.button.color,
  '&:active': {
    ...({
      '& $iconWrapper': {
        boxShadow: theme.button.iconWrapper.negative.boxShadow,
      },
    } as CSSProperties['nestedKey']),
  },

  ...({
    '&$clear': {
      borderColor: `${theme.colors.negative} !important`,
      ...buttonEffects(theme).negativeClearButtonShadow,
    },
    '&$clear$hasLoader $loader > div': {
      backgroundColor: `${theme.colors.negative} !important`,
    },
    '&$clear$iconButton$hasLoader $loader > div': {
      backgroundColor: `transparent !important`,
      borderColor: `${theme.colors.negative} !important`,
      borderBottomColor: `transparent !important`,
    },
    '&$clear$iconButton $icon': {
      fill: `${theme.colors.negative} !important`,
      stroke: `${theme.colors.negative} !important`,
      color: `${theme.colors.negative} !important`,
    },
  } as CSSProperties['nestedKey']),
});

const attention = (theme: CustomTheme): CSSProperties => ({
  background: theme.button.backgrounds.attention,
  ...buttonEffects(theme).attentionButtonShadow,
  color:theme.button.color,
  '&:active': {
    ...({
      '& $iconWrapper': {
        boxShadow: theme.button.iconWrapper.attention.boxShadow,
      },
    } as CSSProperties['nestedKey']),
  },

  ...({
    '&$clear': {
      borderColor: `${theme.colors.attention} !important`,
      ...buttonEffects(theme).attentionClearButtonShadow,
    },
    '&$clear$iconButton $icon': {
      fill: `${theme.colors.attention} !important`,
      stroke: `${theme.colors.attention} !important`,
      color: `${theme.colors.attention} !important`,
    },
    '&$clear$iconButton$hasLoader $loader > div': {
      backgroundColor: `transparent !important`,
      borderColor: `${theme.colors.attention} !important`,
      borderBottomColor: `transparent !important`,
    },
    '&$clear$hasLoader $loader > div': {
      backgroundColor: `${theme.colors.attention} !important`,
    },
  } as CSSProperties['nestedKey']),
});

export const buttonStyles = (theme: CustomTheme) => ({
  button: {
    ...button(theme)
  },
  iconButton: {
    ...iconButton(theme)
  },
  clear: {
    ...clear(theme)
  },
  full,
  hasLoader,

  primary: {
    ...primary(theme)
  },
  secondary: {
    ...secondary(theme)
  },
  positive: {
    ...positive(theme)
  },
  negative: {
    ...negative(theme)
  },
  attention: {
    ...attention(theme)
  },
}) as const;
