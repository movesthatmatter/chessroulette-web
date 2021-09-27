import hexToRGBA from 'hex-to-rgba';
import { CSSProperties } from 'src/lib/jss';
import { CustomTheme } from 'src/theme';
import { getBoxShadow } from 'src/theme/util';

const primaryButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(theme.colors.primary, 0.26)),
});

const primaryClearButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(theme.colors.primary, 0.1)),
});

const secondaryButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(theme.colors.secondary, 0.26)),
});

const secondaryClearButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(theme.colors.secondary, 0.16)),
});

const attentionButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(theme.colors.attention, 0.26)),
});

const attentionClearButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(theme.colors.attention, 0.16)),
});

const positiveButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(theme.colors.positive, 0.26)),
});

const positiveClearButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(theme.colors.positive, 0.16)),
});

const negativeButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(theme.colors.negative, 0.26)),
});

const negativeClearButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(theme.colors.negative, 0.16)),
});

const neutralButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(theme.colors.neutral, 0.26)),
});

const neutralClearButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(theme.colors.neutral, 0.16)),
});

const onClickTransition = {
  transition: 'transform 100ms linear',

  '&:active': {
    transform: 'scale(.9)',
  },
  '&:disabled': {
    transform: 'scale(1) !important',
    cursor: 'auto',
  },
};

export const buttonEffects = (theme: CustomTheme) => ({
  primaryButtonShadow: {
    ...primaryButtonShadow(theme),
  },
  primaryClearButtonShadow: {
    ...primaryClearButtonShadow(theme),
  },
  secondaryButtonShadow: {
    ...secondaryButtonShadow(theme),
  },
  secondaryClearButtonShadow: {
    ...secondaryClearButtonShadow(theme),
  },
  attentionButtonShadow: {
    ...attentionButtonShadow(theme),
  },
  attentionClearButtonShadow: {
    ...attentionClearButtonShadow(theme),
  },
  positiveButtonShadow: {
    ...positiveButtonShadow(theme),
  },
  positiveClearButtonShadow: {
    ...positiveClearButtonShadow(theme),
  },
  negativeButtonShadow: {
    ...negativeButtonShadow(theme),
  },
  negativeClearButtonShadow: {
    ...negativeButtonShadow(theme),
  },
  neutralButtonShadow: {
    ...neutralButtonShadow(theme),
  },
  neutralClearButtonShadow: {
    ...neutralClearButtonShadow(theme),
  },

  onClickTransition,
});
