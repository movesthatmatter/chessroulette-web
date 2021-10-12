import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createUseStyles, CSSProperties, makeImportant } from 'src/lib/jss';
import { colors } from 'src/theme/colors';
import { Text } from 'src/components/Text';
import cx from 'classnames';
import { Icon as GIcon } from 'grommet-icons';
import { borderRadius } from 'src/theme/effects';
import { useOnClickOutside } from 'src/lib/hooks/useOnClickOutside';
import { hasOwnProperty, noop } from 'src/lib/util';
import { ButtonType } from '../type';
import { buttonStyles } from '../styles/styles';
import { AsyncResult } from 'ts-async-results';
import Loader from 'react-loaders';
import 'loaders.css';
import { fonts, onlyMobile, CustomTheme } from 'src/theme';

export type ActionButtonProps = {
  type: ButtonType;
  label: string;
  reverse?: boolean;
  actionType: 'positive' | 'negative' | 'attention';
  confirmation?: string;
  onSubmit: (() => void) | (() => Promise<any>) | (() => AsyncResult<any, any>);
  className?: string;
  hideLabelUntilHover?: boolean;
  withLoader?: boolean;
  full?: boolean;
  disabled?: boolean;
  onFirstClick?: () => void;
} & (
  | {
      icon: GIcon;
      iconComponent?: null;
    }
  | {
      iconComponent: React.ReactNode;
      icon?: null;
    }
);

export const ActionButton: React.FC<ActionButtonProps> = ({
  className,
  hideLabelUntilHover = true,
  withLoader = false,
  full = false,
  onFirstClick = noop,
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

  useEffect(() => {
    if (props.disabled) {
      setFocused(false);
      setHovered(false);
      setIsLoading(false);
    }
  }, [props.disabled]);

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
  };

  return (
    <button
      ref={wrapperRef}
      className={cx(
        cls.button,
        props.disabled || cls[props.type],
        full && cls.full,
        focused && cls[props.actionType],
        isLoading && cls.hasLoader,
        className
      )}
      disabled={props.disabled}
      type="submit"
      {...(props.disabled || {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(!hideLabelUntilHover),
        onClick: () => {
          if (isLoading) {
            return;
          }

          setFocused((prev) => {
            if (prev) {
              submit();
            } else {
              onFirstClick();
            }

            return !prev;
          });
        },
      })}
      style={{
        ...(props.reverse && {
          flexDirection: 'row-reverse',
        }),
      }}
    >
      <div className={cls.iconWrapper}>
        {Icon ? <Icon className={cls.icon} /> : props.iconComponent}
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
            <div
              className={cls.label}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <Loader type="ball-pulse" active innerClassName={cls.loader} />
            </div>
          )}
        </div>
      )}
    </button>
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  ...buttonStyles(theme),
  button: {
    ...buttonStyles(theme).button,
    ...fonts.small1,
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 0,
    paddingRight: 0,

    '&:hover': {
      opacity: 1,
    },
  },
  full: {
    ...buttonStyles(theme).full,

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
    ...fonts.small1,
    color: colors.universal.white,
    fontWeight: 600, // TODO: Make it SemiBold
    lineHeight: '32px',
    direction: 'ltr',

    ...onlyMobile({
      ...makeImportant({
        fontSize: '12px',
        lineHeight: '32px',
        paddingRight: '13px',
        paddingLeft: '13px',
      }),
    }),
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
    fill: `${colors.universal.white} !important`,
    stroke: `${colors.universal.white} !important`,
    color: `${colors.universal.white} !important`,
    width: '16px !important',
    height: '16px !important',
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
}));
