import React from 'react';
import { Button as GButton, ButtonProps as GButtonProps } from 'grommet';

export type ButtonProps = GButtonProps & {
  onClick: () => void;
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({
  label,
  ...props
}) => (
  <GButton
    {...props}
    type="button"
    label={label}
  />
);
