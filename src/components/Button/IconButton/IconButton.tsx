import React, { useMemo, useState } from 'react';
import cx from 'classnames';
import { createUseStyles, makeImportant, NestedCSSElement } from 'src/lib/jss';
import { Icon as GIcon } from 'grommet-icons';
import { borderRadius, onlyMobile, softBorderRadius, softOutline } from 'src/theme';
import { ButtonType } from '../type';
import { buttonStyles } from '../styles/styles';
import { AsyncResult } from 'ts-async-results';
import { spacers } from 'src/theme/spacers';
import { Text } from 'src/components/Text';
import { getSizers } from 'src/theme/sizers';
import { IconProps as IconlyIconProps } from 'react-iconly';
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { buttonEffects } from '../styles';
import { colors } from 'src/theme/colors';
import { IconContainer } from './components/IconContainer';
import Loader from 'react-loaders';
import 'loaders.css';

const sizers = getSizers(1); // This is twice the regular size

const WrapperSizeInPxByName = {
  small: sizers.get(1.5),
  default: sizers.get(2),
  large: sizers.get(3),
} as const;

type Props = {
  onSubmit: (() => void) | (() => Promise<any>) | (() => AsyncResult<any, any>);
  size?: 'small' | 'default' | 'large';
  type?: ButtonType;
  clear?: boolean;
  disabled?: boolean;
  withLoader?: boolean;
  className?: string;
  title?: string;
  tooltip?: string;
  tooltipOnHover?: boolean;
} & IconProps;

type IconProps =
  | {
      iconType: 'grommet';
      icon: GIcon;
    }
  | {
      iconType: 'iconly';
      icon: React.FC<IconlyIconProps>;
      iconPrimaryColor?: string;
    }
  | {
      iconType: 'fontAwesome';
      icon: FontAwesomeIconProps['icon'];
    };

export const IconButton: React.FC<Props> = ({
  type = 'primary',
  clear = false,
  withLoader = false,
  tooltipOnHover = true,
  size = 'default',
  ...props
}) => {
  const cls = useStyles();
  const [isLoading, setIsLoading] = useState(false);

  // These optimization are cool but they aren't actually the issue
  // The parent rerenders badly
  const style = useMemo(
    () => ({
      width: WrapperSizeInPxByName[size],
      height: WrapperSizeInPxByName[size],
      lineHeight: WrapperSizeInPxByName[size],
    }),
    [size]
  );

  return (
    <button
      disabled={props.disabled}
      type="submit"
      className={cx(
        cls.button,
        cls.iconButton,
        clear && cls.clear,
        props.disabled || cls[type],
        isLoading && cls.hasLoader,
        props.className
      )}
      style={style}
      title={props.title}
      onClick={() => {
        if (isLoading) {
          return;
        }

        const result = props.onSubmit();

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
      <div
        className={cls.iconWrapper}
        style={{
          width: WrapperSizeInPxByName[size],
          height: WrapperSizeInPxByName[size],
        }}
      >
        {isLoading ? (
          <Loader type="ball-clip-rotate" active innerClassName={cls.loader} />
        ) : (
          <IconContainer {...props} type={type} size={size} />
        )}
      </div>
      {props.tooltip && (
        <div className={cx(cls.tooltipContainer)}>
          <div className={cx(cls.tooltipText, tooltipOnHover && cls.tooltipOnHover)}>
            <Text size="small1">{props.tooltip}</Text>
          </div>
        </div>
      )}
    </button>
  );
};

const useStyles = createUseStyles((theme) => ({
  ...buttonStyles(theme),
  secondary: {
    ...buttonStyles(theme).secondary,
    ...({
      '&$clear': {
        borderColor: `${theme.colors.secondaryDark} !important`,
        ...buttonEffects(theme).secondaryClearButtonShadow,
      },
    } as NestedCSSElement),
  },
  button: {
    ...buttonStyles(theme).button,
    height: sizers.default,
    width: sizers.default,
    lineHeight: sizers.default,
    ...onlyMobile({
      ...makeImportant({
        height: `${sizers.smallPx - 4}px`,
        width: `${sizers.smallPx - 4}px`,
        lineHeight: `${sizers.smallPx - 4}px`,
        marginBottom: '13px',
      }),
    }),

    position: 'relative',

    ...({
      '&:hover $tooltipOnHover': {
        ...makeImportant({
          opacity: 1,
          transitionDelay: '.75s',
        }),
      },
    } as NestedCSSElement),
  },
  clear: {
    ...buttonStyles(theme).clear,
  },
  iconWrapper: {
    width: sizers.default,
    height: sizers.default,

    ...onlyMobile({
      ...makeImportant({
        width: `${sizers.smallPx - 4}px`,
        height: `${sizers.smallPx - 4}px`,
      }),
    }),

    ...borderRadius,

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

    ...onlyMobile({
      ...makeImportant({
        width: '14px',
        height: '14px',
      }),
    }),
  },
  loadingWrapper: {
    position: 'absolute',
    top: '3px',
    left: 0,
    right: 0,
    bottom: '3px',
    display: 'flex',
    flexDirection: 'row',
  },
  loader: {
    transform: 'scale(.6)',
    display: 'flex',
  },
  tooltipContainer: {
    position: 'absolute',
    transition: 'opacity 500ms linear',

    bottom: '-120%',
    transform: 'translateX(-25%)',
    marginTop: spacers.large,
    zIndex: 999,
  },
  tooltipOnHover: {
    opacity: 0,
    transitionDelay: '0s',
  },
  tooltipText: {
    marginLeft: spacers.small,
    padding: spacers.small,
    lineHeight: 0,
    background: theme.colors.white,
    boxShadow: '0 6px 13px rgba(16, 30, 115, 0.08)',
    ...softOutline,
    ...softBorderRadius,
  },
}));
