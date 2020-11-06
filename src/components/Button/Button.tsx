import React from 'react';
import { Button as GButton, ButtonProps as GButtonProps } from 'grommet';
import { createUseStyles } from 'src/lib/jss';

export type ButtonProps = GButtonProps & {
  onClick: () => void;
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({
  label,
  ...props
}) => {
  const cls = useStyles();

  return (
    <GButton
      {...props}
      type="button"
      label={label}
    />
  )
}

const useStyles = createUseStyles({
  container: {},
});