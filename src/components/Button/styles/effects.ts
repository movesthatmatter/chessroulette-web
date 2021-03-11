import hexToRGBA from 'hex-to-rgba';
import { colors } from 'src/theme';


const getBoxShadow = (
  x: number,
  y: number,
  blur: number,
  inset: number,
  color: string,
) => {
  return `${x}px ${y}px ${blur}px ${inset}px ${color}`;
};

const primaryButtonShadow = {
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(colors.primary, 0.26)),
};

const primaryClearButtonShadow = {
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(colors.primary, 0.1)),
}

const secondaryButtonShadow = {
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(colors.secondary, 0.26)),
};

const secondaryClearButtonShadow = {
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(colors.secondary, 0.16)),
};

const attentionButtonShadow = {
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(colors.attention, 0.26)),
};

const attentionClearButtonShadow = {
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(colors.attention, 0.16)),
};

const positiveButtonShadow = {
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(colors.positive, 0.26)),
};

const positiveClearButtonShadow = {
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(colors.positive, 0.16)),
};

const negativeButtonShadow = {
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(colors.negative, 0.26)),
};

const negativeClearButtonShadow = {
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(colors.negative, 0.16)),
};

const neutralButtonShadow = {
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(colors.neutral, 0.26)),
};

const neutralClearButtonShadow = {
  boxShadow: getBoxShadow(0, 6, 12, 0, hexToRGBA(colors.neutral, 0.16)),
};

const onClickTransition = {
  transition: 'transform 100ms linear',

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
  primaryClearButtonShadow,
  secondaryButtonShadow,
  secondaryClearButtonShadow,
  attentionButtonShadow,
  attentionClearButtonShadow,
  positiveButtonShadow,
  positiveClearButtonShadow,
  negativeButtonShadow,
  negativeClearButtonShadow,
  neutralButtonShadow,
  neutralClearButtonShadow,

  onClickTransition,
};