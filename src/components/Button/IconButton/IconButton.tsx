import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Icon as GIcon } from 'grommet-icons';
import { borderRadius, colors } from 'src/theme';
import cx from 'classnames';
import { CSSProperties } from 'src/lib/jss/types';
import { buttonEffects } from '../effects';
import hexToRGBA from 'hex-to-rgba';
import { ButtonType } from '../type';
import { buttonStyles } from '../styles';

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
        cls.button,
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
  ...buttonStyles,
  iconWrapper: {
    width: '32px',
    height: '32px',

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
});