import React from 'react';
import { IconProps } from 'react-iconly';
import { colors } from 'src/theme';
import { ButtonType } from '../../type';

type Props = Omit<IconProps, 'size'> & {
  Icon: React.FC<IconProps>;
  sizeInPx?: string;
  type?: ButtonType;
  clear?: boolean;
  disabled?: boolean;
  withLoader?: boolean;
};

export const IconlyIcon: React.FC<Props> = ({
  Icon,
  clear,
  sizeInPx,
  type = 'primary',
  disabled,
  withLoader,
  ...iconProps
}) => (
  <Icon
    primaryColor={
      disabled && clear
        ? colors.neutralLight
        : type === 'secondary' && clear
        ? colors.secondaryDark
        : clear
        ? colors[type]
        : type === 'secondary'
        ? colors.neutralDarkest
        : colors.white
    }
    style={{
      width: sizeInPx,
    }}
    {...iconProps}
  />
);
