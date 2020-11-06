import React, { useCallback, useRef, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { colors } from 'src/theme/colors';
import { Text } from 'src/components/Text';
import cx from 'classnames';
import { Icon as GIcon } from 'grommet-icons';
import { borderRadius } from 'src/theme/effects';
import { useOnClickOutside } from 'src/lib/hooks/useOnClickOutside';
import { hasOwnProperty } from 'src/lib/util';
import { buttonEffects } from '../effects';
import { ButtonType } from '../type';
import { buttonStyles } from '../styles';

export type ActionButtonProps = {
  type: ButtonType;
  icon: GIcon;
  label: string;
  reverse?: boolean;
  actionType: 'positive' | 'negative',
  confirmation?: string,
  onSubmit: () => void;
  className?: string;
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  className,
  ...props
}) => {
  const Icon = props.icon;

  const confirmation = hasOwnProperty(props, 'confirmation')
    ? props.confirmation
    : `Confirm ${props.label}`;
  
  const cls = useStyles();
  const wrapperRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);  

  const onClickedOutsideCB = useCallback(() => {
    if (focused) {
      setFocused(false);
    }
  }, [focused]);

  useOnClickOutside(wrapperRef, onClickedOutsideCB);

  return (
    <button
      ref={wrapperRef}
      className={cx(
        cls.button,
        cls[props.type],
        focused && (props.actionType === 'negative' ? cls.confirmNegative : cls.confirmPositive),
        className,
      )}
      type="submit"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={() => {
        setFocused((prev) => {
          if (prev) {
            props.onSubmit();
            setHovered(false);
          }
          return !prev;
        });
      }}
      style={{
        // backgroundColor: colors[props.type],
       ...props.reverse && {
         flexDirection: 'row-reverse',
       }
      }}
    >
      <div className={cls.iconWrapper}>
        <Icon className={cls.icon}/>
      </div>
      {(hovered || focused) && (
        <div 
          className={cls.labelWrapper}
          style={{
            ...props.reverse ? {
              paddingLeft: '16px',
              paddingRight: '8px',
            } : {
              paddingLeft: '8px',
              paddingRight: '16px',
            }
          }}
        >
          <Text className={cls.label}>
            {focused ? confirmation : props.label}
          </Text>
        </div>
      )}
    </button>
  );
};

const useStyles = createUseStyles({
  ...buttonStyles,
  button: {
    ...buttonStyles.button,
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 0,
    paddingRight: 0,
  },
  circle: {},
  closed: {},
  labelWrapper: {},
  label: {
    color: colors.white,
    fontWeight: 600, // TODO: Make it SemiBold
    fontSize: '14px',
    lineHeight: '32px',
    direction: 'ltr',
  },
  iconWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    ...borderRadius,
    width: '32px',
    height:'32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fill: `${colors.white} !important`,
    stroke: `${colors.white} !important`,
    width: '16px !important',
    height: '16px !important',
  },

  confirmPositive: {
    backgroundColor: `${colors.positive} !important`,
    ...buttonEffects.positiveButtonShadow,
  },
  confirmNegative: {
    backgroundColor: `${colors.negative} !important`,
    ...buttonEffects.negativeButtonShadow,
  },
});
