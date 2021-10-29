import { CSSProperties } from 'src/lib/jss';
import { CustomTheme } from 'src/theme';

const primaryButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: theme.button.effects.primary.boxShadow,
});

const primaryClearButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: theme.button.effects.primaryClear.boxShadow,
});

const secondaryButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: theme.button.effects.secondary.boxShadow,
});

const secondaryClearButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: theme.button.effects.secondaryClear.boxShadow,
});

const attentionButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: theme.button.effects.attention.boxShadow,
});

const attentionClearButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: theme.button.effects.attentionClear.boxShadow,
});

const positiveButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: theme.button.effects.positive.boxShadow,
});

const positiveClearButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: theme.button.effects.positiveClear.boxShadow,
});

const negativeButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: theme.button.effects.negative.boxShadow,
});

const negativeClearButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: theme.button.effects.negativeClear.boxShadow,
});

const neutralButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: theme.button.effects.neutral.boxShadow,
});

const neutralClearButtonShadow = (theme: CustomTheme): CSSProperties => ({
  boxShadow: theme.button.effects.neutralClear.boxShadow,
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
