import React, { useCallback, useRef, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { colors } from 'src/theme/colors';
import { Text } from 'grommet';
import cx from 'classnames';
import { Icon as GIcon } from 'grommet-icons';
import { borderRadius } from 'src/theme/effects';
import { useOnClickOutside } from 'src/lib/hooks/useOnClickOutside';
import { hasOwnProperty } from 'src/lib/util';
import { buttonEffects } from '../IconButton/effects';

export type ButtonType = 
  | 'primary'
  | 'positive'
  | 'negative'
  | 'attention';

export type ActionButtonProps = {
  type: ButtonType;
  icon: GIcon;
  label: string;
  reverse?: boolean;
  actionType: 'positive' | 'negative',
  confirmation?: string,
  onSubmit: () => void;
};

export const ActionButton: React.FC<ActionButtonProps> = (props) => {
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
        focused && (props.actionType === 'negative' ? cls.confirmNegative : cls.confirmPositive)
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
  button: {
    cursor: 'pointer',
    width: 'auto',
    border: 0,
    padding: 0,
    margin: 0,
    
    ...borderRadius,
    height: '32px',
    lineHeight: '32px',
    display: 'flex',
    flexDirection: 'row',

    '&:focus': {
      outline: 'none',
    },
  },
  circle: {},
  primary: {
    background: colors.primary,
    ...buttonEffects.primaryButtonShadow,
  },
  positive: {
    background: colors.positive,
    ...buttonEffects.positiveButtonShadow,
  },
  negative: {
    background: colors.negative,
    ...buttonEffects.negativeButtonShadow,
  },
  attention: {
    background: colors.attention,
    ...buttonEffects.attentionButtonShadow,
  },
  closed: {},
  labelWrapper: {
    // padding: '0 12px 0 16px',
  },
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
    fill: colors.white,
    stroke: colors.white,
    width: '16px',
    height: '16px',
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
