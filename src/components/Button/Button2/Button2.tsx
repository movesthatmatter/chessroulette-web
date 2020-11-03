import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { ButtonType } from '../type';
import { Icon as GIcon } from 'grommet-icons';
import cx from 'classnames';
import { buttonStyles } from '../styles';
import { borderRadius, colors } from 'src/theme';
import { Text } from 'grommet';
import { buttonEffects } from '../effects';


export type ButtonProps = {
  type?: ButtonType;
  icon?: GIcon;
  label: string;
  reverse?: boolean;
  onClick: () => void;
  disabled?: boolean;
  clear?: boolean;
  full?: boolean;
  containerClassName?: string;
  className?: string;
  size?: 'auto' | 'small' | 'medium' | 'large';
};

export const Button: React.FC<ButtonProps> = ({
  type = 'primary',
  clear = false,
  full = false,
  reverse = false,
  size = 'auto',
  ...props
}) => {
  const cls = useStyles();
  const Icon = props.icon;

  return (
    <div className={cx(cls.container, props.containerClassName)}>
      <button
        disabled={props.disabled}
        type="submit"
        className={cx(
          cls.button,
          props.disabled || cls[type],
          clear && cls.clear,
          full && cls.full,
          props.icon && cls.withIcon,
          reverse && cls.reverse,
          size !== 'auto' && cls[size],
          props.className,
        )}
        onClick={() => props.onClick()}
      >
        <Text className={cls.label}>
          {props.label}
        </Text>
        {Icon && (
          <div className={cls.iconWrapper}>
            <Icon className={cls.icon}/>
          </div>
        )}
      </button>
    </div>
  );
};

const useStyles = createUseStyles({
  ...buttonStyles,
  container: {

  },
  withIcon: {
    display: 'flex',
    flexDirection: 'row',
    // paddingRight: `0 !important`,
  },
  reverse: {
    flexDirection: 'row-reverse',

    ...{
      '& $iconWrapper': {
        marginLeft: 0,
        marginRight: '-8px',
      }
    }
  },
  small: {
    minWidth: '100px',
  },
  medium: {
    minWidth: '180px',
  },
  large: {
    minWidth: '250px',
  },
  label: {
    color: colors.white,
    fontWeight: 600, // TODO: Make it SemiBold
    fontSize: '14px',
    lineHeight: '32px',
    direction: 'ltr',
    width: '100%',
    paddingRight: '16px',
    paddingLeft: '16px',
  },
  iconWrapper: {
    height: '32px',
    padding: '0 8px',
    marginLeft: '-8px',

    ...borderRadius,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  icon: {
    fill: `${colors.white} !important`,
    stroke: `${colors.white} !important`,
    width: '16px !important',
    height: '16px !important',
  },
});