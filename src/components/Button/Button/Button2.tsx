import React, { useEffect, useState } from 'react';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { ButtonType } from '../type';
import cx from 'classnames';
import { buttonStyles } from '../styles/styles';
import { borderRadius, CustomTheme, onlyMobile } from 'src/theme';
import { Text } from 'src/components/Text';
import { CSSProperties } from 'src/lib/jss/types';
import Loader from 'react-loaders';
import 'loaders.css';
import { AsyncResult } from 'ts-async-results';
import { Badge, BadgeProps } from 'src/components/Badge';
import { spacers } from 'src/theme/spacers';

export type ButtonProps = {
  type?: ButtonType;
  // Difficult typing different icon packs
  icon?: React.ComponentType<any>;
  iconWrapperStyle?: CSSProperties;
  label: string;
  reverse?: boolean;

  disabled?: boolean;
  clear?: boolean;
  full?: boolean;
  containerClassName?: string;
  className?: string;
  size?: 'auto' | 'small' | 'medium' | 'large' | 'xsmall';
  style?: CSSProperties;
  onClick: (() => void) | (() => Promise<any>) | (() => AsyncResult<any, any>);
  withLoader?: boolean;
  isLoading?: boolean;
  withBadge?: BadgeProps & {
    side?: 'left' | 'right';
  };
};

export const Button: React.FC<ButtonProps> = ({
  type = 'primary',
  clear = false,
  full = false,
  reverse = false,
  withLoader = false,
  isLoading: isLoadingProp = false,
  size = 'auto',
  ...props
}) => {
  const cls = useStyles();
  const Icon = props.icon;
  const [isLoading, setIsLoading] = useState(isLoadingProp);

  useEffect(() => {
    setIsLoading(isLoadingProp);
  }, [isLoadingProp]);

  return (
    <div className={cx(cls.container, props.containerClassName, full && cls.containerFull)}>
      <button
        disabled={props.disabled}
        type="submit"
        className={cx(
          cls.button,
          props.disabled || cls[type],
          clear && cls.clear,
          full && cls.full,
          size !== 'auto' && cls[size],
          isLoading && cls.hasLoader,
          props.className
        )}
        style={props.style}
        onClick={() => {
          if (isLoading) {
            return;
          }

          const result = props.onClick();

          if (!withLoader) {
            return;
          }

          if (AsyncResult.isAsyncResult(result)) {
            setIsLoading(true);

            result.map(() => setIsLoading(false)).mapErr(() => setIsLoading(false));
          } else {
            setIsLoading(true);

            Promise.resolve(result).finally(() => {
              setIsLoading(false);
            });
          }
        }}
      >
        <>
          {props.withBadge && (
            <Badge
              {...props.withBadge}
              className={cls.badge}
              style={
                props.withBadge.side === 'right'
                  ? {
                      left: 'auto',
                      right: '-14px',
                    }
                  : {}
              }
            />
          )}
          <div className={cx(cls.content, reverse && cls.reverse, props.icon && cls.withIcon)}>
            {Icon && <div className={cls.icon} />}
            <Text
              className={cls.label}
              style={{
                ...(isLoading && {
                  visibility: 'hidden',
                }),
              }}
            >
              {props.label}
            </Text>
            {Icon && (
              <div className={cls.iconWrapper} style={props.iconWrapperStyle}>
                <Icon className={cls.icon} />
              </div>
            )}
          </div>
          {isLoading && (
            <div className={cls.loadingWrapper}>
              <Loader type="ball-pulse" active innerClassName={cls.loader} />
            </div>
          )}
        </>
      </button>
    </div>
  );
};

const useStyles = createUseStyles(theme => ({
  ...buttonStyles(theme),
  button: {
    ...buttonStyles(theme).button,
    position: 'relative',
    zIndex: 0,
  },
  container: {},
  containerFull: {
    flex: 1,
  },
  withIcon: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  reverse: {
    ...makeImportant({
      flexDirection: 'row-reverse',

      ...{
        '& $iconWrapper': {
          marginLeft: 0,
          marginRight: '-8px',
        },
      },
    }),
  },
  small: {
    minWidth: '100px',
  },
  xsmall: {
    minWidth: '60px',
  },
  medium: {
    minWidth: '180px',
  },
  large: {
    minWidth: '250px',
  },
  label: {
    //color: theme.button.color,
    fontWeight: theme.button.font.weight, // TODO: Make it SemiBold
    fontSize: '14px',
    lineHeight: '32px',
    paddingRight: '16px',
    paddingLeft: '16px',
    flex: 1,
    
    ...onlyMobile({
      ...makeImportant({
        fontSize: '12px',
        lineHeight: '28px',
        paddingRight: '13px',
        paddingLeft: '13px',
      }),
    }),
  },
  content: {
    width: '100%',
    direction: 'ltr',
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'center',
  },
  iconWrapper: {
    height: '32px',
    width: '32px',
    // padding: '0px',
    marginLeft: '-8px',

    ...onlyMobile({
      ...makeImportant({
        height: '28px',
        width: '28px',
      }),
    }),

    ...borderRadius,
    color: theme.button.icon.color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
   // backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  icon: makeImportant({
    fill: theme.button.icon.color,
    stroke: theme.button.icon.color,
    width: spacers.default,
    height: spacers.default,
  }),
  loadingWrapper: {
    position: 'absolute',
    top: '3px',
    left: 0,
    right: 0,
    bottom: '3px',
  },
  loader: {
    transform: 'scale(.5)',
  },
  badge: {
    position: 'absolute',
    top: '-10px',
    left: '-14px',
    zIndex: 1,
  },
}));
