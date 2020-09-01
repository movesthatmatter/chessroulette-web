import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Button as GButton, ButtonProps as GButtonProps } from 'grommet';
import cx from 'classnames';

type Props = GButtonProps & {
  onClick: () => void;
  className?: string;
};

export const Button: React.FC<Props> = ({
  label,
  ...props
}) => {
  const cls = useStyles();

  return (
    <GButton
      {...props}
      type="button"
      label={label}
      // focusIndicator={false}
    />

  );
};

const useStyles = createUseStyles({
  // button: {
  // marginBottom: '1em !important',
  // margin: '1em',
  // '&:hover': {
  //   opacity: 0.8,
  //   boxShadow: 'none !important',
  // },
  // '&:focus': {
  //   outline: 'none !important',
  //   boxShadow: 'none !important',
  //   },
  // },
});
