import hexToRGBA from 'hex-to-rgba';
import { colors } from 'src/theme';

const primaryButtonShadow = {
  boxShadow: `0 6px 12px 0 ${hexToRGBA(colors.primary, 0.26)}`
};

const secondaryButtonShadow = {
  boxShadow: `0 6px 12px 0 ${hexToRGBA(colors.secondary, 0.26)}`
};

const attentionButtonShadow = {
  boxShadow: `0 6px 12px 0 ${hexToRGBA(colors.attention, 0.26)}`
};

const positiveButtonShadow = {
  boxShadow: `0 6px 12px 0 ${hexToRGBA(colors.positive, 0.26)}`
};

const negativeButtonShadow = {
  boxShadow: `0 6px 12px 0 ${hexToRGBA(colors.negative, 0.26)}`
};

const neutralButtonShadow = {
  boxShadow: `0 6px 12px 0 ${hexToRGBA(colors.neutral, 0.26)}`
};

const onClickTransition = {
  transition: 'all 100ms linear',

  '&:active': {
    transform: 'scale(.9)',
  },
  '&:disabled': {
    transform: 'scale(1) !important',
    cursor: 'auto',
  }
};

export const buttonEffects = {
  primaryButtonShadow,
  secondaryButtonShadow,
  attentionButtonShadow,
  positiveButtonShadow,
  negativeButtonShadow,
  neutralButtonShadow,

  onClickTransition,
};