import React, { useCallback, useRef, useState } from 'react';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
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
import { AsyncResult } from 'dstnd-io';
import Loader from 'react-loaders';
import 'loaders.css';

export type ActionButtonProps = {
  type: ButtonType;
  icon: GIcon;
  label: string;
  reverse?: boolean;
  actionType: 'positive' | 'negative';
  confirmation?: string;
  onSubmit: (() => void) | (() => Promise<any>) | (() => AsyncResult<any, any>);
  className?: string;
  hideLabelUntilHover?: boolean;
  withLoader?: boolean;
  full?: boolean;
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  className,
  hideLabelUntilHover = true,
  withLoader = false,
  full = false,
  ...props
}) => {
  const Icon = props.icon;

  const confirmation = hasOwnProperty(props, 'confirmation')
    ? props.confirmation
    : `Confirm ${props.label}`;

  const cls = useStyles();
  const wrapperRef = useRef(null);
  const [hovered, setHovered] = useState(!hideLabelUntilHover);
  const [focused, setFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onClickedOutsideCB = useCallback(() => {
    if (isLoading) {
      return;
    }

    if (focused) {
      setFocused(false);
    }
  }, [focused, isLoading]);

  useOnClickOutside(wrapperRef, onClickedOutsideCB);

  const submit = () => {
    const result = props.onSubmit();

    if (!withLoader) {
      setHovered(!hideLabelUntilHover);
    }

    setFocused(true);

    if (AsyncResult.isAsyncResult(result)) {
      setIsLoading(true);

      result
        .map(() => {
          setIsLoading(false);
          setFocused(false);
          setHovered(!hideLabelUntilHover);
        })
        .mapErr(() => {
          setIsLoading(false);
          setFocused(false);
          setHovered(!hideLabelUntilHover);
        });
    } else {
      setIsLoading(true);

      Promise.resolve(result).finally(() => {
        setIsLoading(false);
        setFocused(false);
        setHovered(!hideLabelUntilHover);
      });
    }
  }

  return (
    <button
      ref={wrapperRef}
      className={cx(
        cls.button,
        cls[props.type],
        full && cls.full,
        focused && (props.actionType === 'negative' ? cls.confirmNegative : cls.confirmPositive),
        isLoading && cls.hasLoader,
        className
      )}
      type="submit"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(!hideLabelUntilHover)}
      onClick={() => {
        if (isLoading) {
          return;
        }

        setFocused((prev) => {
          if (prev) {
            submit();
          }

          return !prev;
        });
      }}
      style={{
        // backgroundColor: colors[props.type],
        ...(props.reverse && {
          flexDirection: 'row-reverse',
        }),
      }}
    >
      <div className={cls.iconWrapper}>
        <Icon className={cls.icon} />
      </div>
      {(hovered || focused) && (
        <div
          className={cls.labelWrapper}
          style={{
            ...(props.reverse
              ? {
                  paddingLeft: '16px',
                  paddingRight: '8px',
                }
              : {
                  paddingLeft: '8px',
                  paddingRight: '16px',
                }),
          }}
        >
          <Text
            className={cls.label}
            style={{
              ...(isLoading && {
                visibility: 'hidden',
              }),
            }}
          >
            {focused ? confirmation : props.label}
          </Text>
          {isLoading && (
            <div className={cls.label} style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}>
              <Loader type="ball-pulse" active innerClassName={cls.loader} />
            </div>
          )}
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

    '&:hover': {
      opacity: 1,
    },
  },
  full: {
    ...buttonStyles.full,

    ...({
      '& $labelWrapper': {
        textAlign: 'center',
        flex: 1,
      },
    } as CSSProperties['nestedKey']),
  },
  circle: {},
  closed: {},
  labelWrapper: {
    position: 'relative',
  },
  label: {
    color: colors.white,
    fontWeight: 600, // TODO: Make it SemiBold
    lineHeight: '32px',
    direction: 'ltr',
  },
  iconWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    ...borderRadius,
    width: '32px',
    height: '32px',
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
  loadingWrapper: {
    position: 'absolute',
    top: '3px',
    left: 0,
    right: 0,
    bottom: '3px',
  },
  loader: {
    paddingTop: '4px',
    transform: 'scale(.5)',
  },
});
