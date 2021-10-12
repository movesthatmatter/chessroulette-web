import React, { useState } from 'react';
import { createUseStyles, CSSProperties, makeImportant, NestedCSSElement } from 'src/lib/jss';
import { Icon as GIcon } from 'grommet-icons';
import { borderRadius, CustomTheme, onlyMobile, softBorderRadius, softOutline } from 'src/theme';
import cx from 'classnames';
import { ButtonType } from '../type';
import { buttonStyles } from '../styles/styles';
import { AsyncResult } from 'ts-async-results';
import Loader from 'react-loaders';
import 'loaders.css';
import { spacers } from 'src/theme/spacers';
import { Text } from 'src/components/Text';
import { getSizers } from 'src/theme/sizers';
import { IconProps as IconlyIconProps } from 'react-iconly';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { IconlyIcon } from './components/IconlyIcon';
import { buttonEffects } from '../styles';

const sizers = getSizers(1); // This is twice the regular size

const IconSizeInPxByName = {
  small: sizers.get(0.75),
  default: sizers.get(1),
  large: sizers.get(1.5),
} as const;

const WrapperSizeInPxByName = {
  small: sizers.get(1.5),
  default: sizers.get(2),
  large: sizers.get(3),
} as const;

type Props = {
  onSubmit: (() => void) | (() => Promise<any>) | (() => AsyncResult<any, any>);
  size?: keyof typeof IconSizeInPxByName;
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

const getIcon = (
  {
    size = 'default',
    ...props
  }: IconProps & Pick<Props, 'clear' | 'disabled' | 'type' | 'withLoader' | 'size'>,
  { className, style }: { className?: string; style?: CSSProperties }
) => {
  if (props.iconType === 'iconly') {
    const { icon: Icon, iconPrimaryColor, ...restProps } = props;
    console.log('iconPrimaryColor', iconPrimaryColor);
    return (
      <IconlyIcon
        Icon={props.icon}
        primaryColor={iconPrimaryColor}
        sizeInPx={IconSizeInPxByName[size]}
        {...restProps}
      />
    );
  }

  if (props.iconType === 'grommet') {
    const { icon: Icon } = props;
    return <Icon className={className} />;
  }

  return <FontAwesomeIcon icon={props.icon} className={className} style={style} />;
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
  // const Icon = props.icon;
  const [isLoading, setIsLoading] = useState(false);

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
      style={{
        width: WrapperSizeInPxByName[size],
        height: WrapperSizeInPxByName[size],
        lineHeight: WrapperSizeInPxByName[size],
      }}
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
          getIcon({ ...props, clear, type, size }, { className: cls.icon })
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

const useStyles = createUseStyles<CustomTheme>((theme) => ({
  ...buttonStyles,
  secondary: {
    ...buttonStyles.secondary,
    ...({
      '&$clear': {
        borderColor: `${colors.secondaryDark} !important`,
        ...buttonEffects.secondaryClearButtonShadow,
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
    fill: `${theme.colors.white} !important`,
    stroke: `${theme.colors.white} !important`,
    color: `${theme.colors.white} !important`,
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
