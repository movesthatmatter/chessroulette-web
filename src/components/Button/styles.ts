import { CSSProperties } from 'src/lib/jss/types';
import { borderRadius, colors } from 'src/theme';
import { buttonEffects } from './effects';
import hexToRGBA from 'hex-to-rgba';

const button: CSSProperties = {
  cursor: 'pointer',
  width: 'auto',
  border: 0,
  padding: 0,
  margin: 0,
  marginBottom: '16px',

  height: '32px',
  lineHeight: '32px',

  background: colors.neutral,

  '&:focus': {
    outline: 'none',
  },

  display: 'flex',
  flexDirection: 'row',

  ...borderRadius,
  ...buttonEffects.onClickTransition,
};

const clear: CSSProperties = {
  borderWidth: '1px !important',
  borderStyle: 'solid !important',
  borderColor: colors.neutral,
  background: 'transparent !important',

  ...({
    '& $label': {
      color: `${colors.neutralDarkest} !important`,
      // fontWeight: 200,
      lineHeight: '28px',
    },
    '& $iconWrapper': {
      height: '28px',
    },
    '& $icon': {
      // color: `${colors.black} !important`,
      fill: `${colors.black} !important`,
      stroke: `${colors.black} !important`,
    },
  } as CSSProperties['nestedKey']),
};

const full: CSSProperties = {
  width: '100%',
  flex: 1,
  textAlign: 'center',
};

const primary: CSSProperties = {
  background: colors.primary,
  ...buttonEffects.primaryButtonShadow,

  '&:active': {
    ...({
      '& $iconWrapper': {
        boxShadow: `0 3px 6px 0 ${hexToRGBA(colors.primary, 0.36)}`,
      },
    } as CSSProperties['nestedKey']),
  },

  ...({
    '&$clear': {
      borderColor: `${colors.primary} !important`,
    },
  } as CSSProperties['nestedKey']),
};

const secondary: CSSProperties = {
  background: colors.secondary,
  ...buttonEffects.secondaryButtonShadow,

  '&:active': {
    ...({
      '& $iconWrapper': {
        boxShadow: `0 3px 6px 0 ${hexToRGBA(colors.secondary, 0.36)}`,
      },
    } as CSSProperties['nestedKey']),
  },

  ...({
    '&$clear': {
      borderColor: `${colors.secondary} !important`,
    },
    '& $icon': {
      fill: `${colors.neutralDarkest} !important`,
      stroke: `${colors.neutralDarkest} !important`,
    },
    '& $label': {
      color: colors.neutralDarkest,
    },
  } as CSSProperties['nestedKey']),
};

const positive: CSSProperties = {
  background: colors.positive,
  ...buttonEffects.positiveButtonShadow,

  '&:active': {
    ...({
      '& $iconWrapper': {
        boxShadow: `0 3px 6px 0 ${hexToRGBA(colors.positive, 0.36)}`,
      },
    } as CSSProperties['nestedKey']),
  },

  ...({
    '&$clear': {
      borderColor: `${colors.positive} !important`,
    },
  } as CSSProperties['nestedKey']),
};

const negative: CSSProperties = {
  background: colors.negative,
  ...buttonEffects.negativeButtonShadow,

  '&:active': {
    ...({
      '& $iconWrapper': {
        boxShadow: `0 3px 6px 0 ${hexToRGBA(colors.negative, 0.36)}`,
      },
    } as CSSProperties['nestedKey']),
  },

  ...({
    '&$clear': {
      borderColor: `${colors.negative} !important`,
    },
  } as CSSProperties['nestedKey']),
};

const attention: CSSProperties = {
  background: colors.attention,
  ...buttonEffects.attentionButtonShadow,

  '&:active': {
    ...({
      '& $iconWrapper': {
        boxShadow: `0 3px 6px 0 ${hexToRGBA(colors.attention, 0.36)}`,
      },
    } as CSSProperties['nestedKey']),
  },

  ...({
    '&$clear': {
      borderColor: `${colors.attention} !important`,
    },
  } as CSSProperties['nestedKey']),
};

export const buttonStyles = {
  button,
  clear,
  full,

  primary,
  secondary,
  positive,
  negative,
  attention,
} as const;
