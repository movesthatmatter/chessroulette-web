import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Icon as GIcon } from 'grommet-icons';
import { borderRadius, colors } from 'src/theme';
import cx from 'classnames';
import { CSSProperties } from 'src/lib/jss/types';
import { buttonEffects } from './effects';
import hexToRGBA from 'hex-to-rgba';
import { ButtonType } from '../type';

type Props = {
  icon: GIcon;
  onSubmit: () => void;
  type: ButtonType;
  disabled?: boolean;
};

export const IconButton: React.FC<Props> = (props) => {
  const cls = useStyles();
  const Icon = props.icon;

  return (
    <button
      disabled={props.disabled}
      type="submit"
      className={cx(
        cls.container,
        props.disabled || cls[props.type],
      )}
      onClick={() => props.onSubmit()}
    >
      <div className={cls.iconWrapper}>
        <Icon className={cls.icon}/>
      </div>
    </button>
  );
};

const useStyles = createUseStyles({
  container: {
    ...borderRadius,
    width: '32px',
    height:'32px',
    // overflow: 'hidden',
    outline: 'none',
    border: 'none',
    padding: 0,

    cursor: 'pointer',

    background: colors.neutral,
    ...buttonEffects.neutralButtonShadow,

    // ...floatingShadow,
    transition: 'all 100ms linear',

    '&:active': {
      transform: 'scale(.9)',
    },
    '&:disabled': {
      transform: 'scale(1) !important',
      cursor: 'auto',
    }
  },
  iconWrapper: {
    width: '100%',
    height: '100%',

    ...borderRadius,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  icon: {
    fill: `${colors.white} !important`,
    stroke: `${colors.white} !important`,
    width: '16px !important',
    height: '16px !important',
  },
  primary: {
    background: colors.primary,
    ...buttonEffects.primaryButtonShadow,

    '&:active': {
      ...{
        '& $iconWrapper': {
          boxShadow: `0 3px 6px 0 ${hexToRGBA(colors.primary, 0.36)}`
        },
      } as CSSProperties['nestedKey'],
    }
  },
  positive: {
    background: colors.positive,
    ...buttonEffects.positiveButtonShadow,

    '&:active': {
      ...{
        '& $iconWrapper': {
          boxShadow: `0 3px 6px 0 ${hexToRGBA(colors.positive, 0.36)}`
        },
      } as CSSProperties['nestedKey'],
    }
  },
  negative: {
    background: colors.negative,
    ...buttonEffects.negativeButtonShadow,

    '&:active': {
      ...{
        '& $iconWrapper': {
          boxShadow: `0 3px 6px 0 ${hexToRGBA(colors.negative, 0.36)}`
        },
      } as CSSProperties['nestedKey'],
    }
  },
  attention: {
    background: colors.attention,
    ...buttonEffects.attentionButtonShadow,

    '&:active': {
      ...{
        '& $iconWrapper': {
          boxShadow: `0 3px 6px 0 ${hexToRGBA(colors.attention, 0.36)}`
        },
      } as CSSProperties['nestedKey'],
    }
  },
});