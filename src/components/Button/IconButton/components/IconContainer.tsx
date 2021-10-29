import React from 'react';
import { CSSProperties } from 'src/lib/jss';
import { ButtonType } from '../../type';
import { Icon as GIcon } from 'grommet-icons';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { IconProps as IconlyIconProps } from 'react-iconly';
import { IconlyIcon } from './IconlyIcon';
import { getSizers } from 'src/theme/sizers';

type Props = {
  type: ButtonType;
  clear?: boolean;
  disabled?: boolean;
  withLoader?: boolean;
  size: 'small' | 'default' | 'large';
  className?: string;
  style?: CSSProperties;
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

const sizers = getSizers(1); // This is twice the regular size

const IconSizeInPxByName = {
  small: sizers.get(0.75),
  default: sizers.get(1.25),
  large: sizers.get(1.5),
} as const;

export const IconContainer: React.FC<Props> = (props) => {
  if (props.iconType === 'iconly') {
    const { icon: Icon, iconPrimaryColor, ...restProps } = props;
    return (
      <IconlyIcon
        Icon={props.icon}
        primaryColor={iconPrimaryColor}
        sizeInPx={IconSizeInPxByName[props.size]}
        {...restProps}
      />
    );
  }

  if (props.iconType === 'grommet') {
    const { icon: Icon } = props;
    return <Icon className={props.className} />;
  }

  return <FontAwesomeIcon icon={props.icon} className={props.className} style={props.style} />;
};
