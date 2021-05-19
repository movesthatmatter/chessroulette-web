import React, { useEffect, useState } from 'react';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { ButtonType } from '../type';
import { Icon as GIcon } from 'grommet-icons';
import cx from 'classnames';
import { buttonStyles } from '../styles/styles';
import { borderRadius, colors, onlyMobile } from 'src/theme';
import { Text } from 'src/components/Text';
import { CSSProperties } from 'src/lib/jss/types';
import Loader from 'react-loaders';
import 'loaders.css';
import { AsyncResult } from 'dstnd-io';
import { Badge, BadgeProps } from 'src/components/Badge';

export type ButtonProps = {
  type?: ButtonType;
  icon?: GIcon;
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
  withBadge?: BadgeProps;
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
          props.icon && cls.withIcon,
          reverse && cls.reverse,
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

            result
              .map(() => setIsLoading(false))
              .mapErr(() => setIsLoading(false));
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
            <Badge {...props.withBadge} className={cls.badge}/>
          )}
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
          {isLoading && (
            <div className={cls.loadingWrapper}>
              <Loader
                type="ball-pulse"
                active
                innerClassName={cls.loader}
              />
            </div>
          )}
          {Icon && (
            <div className={cls.iconWrapper}>
              <Icon className={cls.icon} />
            </div>
          )}
        </>
      </button>
    </div>
  );
};

const useStyles = createUseStyles({
  ...buttonStyles,
  button: {
    ...buttonStyles.button,
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
  },
  reverse: {
    flexDirection: 'row-reverse',

    ...{
      '& $iconWrapper': {
        marginLeft: 0,
        marginRight: '-8px',
      },
    },
  },
  small: {
    minWidth: '100px',
  },
  xsmall : {
    minWidth: '60px',
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

    ...onlyMobile({
      ...makeImportant({
        fontSize: '12px',
        lineHeight: '28px',
        paddingRight: '13px',
        paddingLeft: '13px',
      }),
    }),
  },
  iconWrapper: {
    height: '32px',
    padding: '0 8px',
    marginLeft: '-8px',

    ...onlyMobile({
      ...makeImportant({
        height: '28px',
      }),
    }),

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
});
