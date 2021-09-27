import { CSSProperties } from 'src/lib/jss/types';
import { borderRadius, CustomTheme, onlyMobile } from 'src/theme';
import { buttonEffects } from './effects';
import hexToRGBA from 'hex-to-rgba';
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

  ...{
    '&:disabled&:hover': {
      opacity: '1 !important',
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
      background: theme.colors.neutral,
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
  background: theme.colors.primary,
  ...buttonEffects(theme).primaryButtonShadow,

  '&:active': {
    ...({
      '& $iconWrapper': {
        boxShadow: `0 3px 6px 0 ${hexToRGBA(theme.colors.primary, 0.36)}`,
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
  background: theme.colors.secondary,
  ...buttonEffects(theme).secondaryButtonShadow,

  '&:active': {
    ...({
      '& $iconWrapper': {
        boxShadow: `0 3px 6px 0 ${hexToRGBA(theme.colors.secondary, 0.36)}`,
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
  background: theme.colors.positive,

  ...buttonEffects(theme).positiveButtonShadow,

  '&:active': {
    ...({
      '& $iconWrapper': {
        boxShadow: `0 3px 6px 0 ${hexToRGBA(theme.colors.positive, 0.36)}`,
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
  background: `${theme.colors.negative}`,
  ...buttonEffects(theme).negativeButtonShadow,

  '&:active': {
    ...({
      '& $iconWrapper': {
        boxShadow: `0 3px 6px 0 ${hexToRGBA(theme.colors.negative, 0.36)}`,
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
  background: theme.colors.attention,
  ...buttonEffects(theme).attentionButtonShadow,

  '&:active': {
    ...({
      '& $iconWrapper': {
        boxShadow: `0 3px 6px 0 ${hexToRGBA(theme.colors.attention, 0.36)}`,
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
