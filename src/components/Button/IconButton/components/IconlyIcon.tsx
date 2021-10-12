import React from 'react';
import { IconProps } from 'react-iconly';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { ButtonType } from '../../type';

type Props = Omit<IconProps, 'size'> & {
  Icon: React.FC<IconProps>;
  sizeInPx?: string;
  type?: ButtonType;
  clear?: boolean;
  disabled?: boolean;
  withLoader?: boolean;
  primaryColor?: string;
};

export const IconlyIcon: React.FC<Props> = ({
  Icon,
  clear,
  sizeInPx,
  type = 'primary',
  disabled,
  withLoader,
  primaryColor,
  ...iconProps
}) => {
  const { theme } = useColorTheme();

  return (
    <Icon
      primaryColor={
        primaryColor ||
        (disabled && clear
          ? theme.colors.neutralLight
          : type === 'secondary' && clear
          ? theme.colors.secondaryDark
          : clear
          ? theme.colors[type]
          : type === 'secondary'
          ? theme.colors.neutralDarkest
          : theme.colors.white)
      }
      style={{
        width: sizeInPx,
      }}
      {...iconProps}
    />
  );
};
