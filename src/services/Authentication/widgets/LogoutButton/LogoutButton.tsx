import React from 'react';
import { Box } from 'grommet';
import { Button, ButtonProps } from 'src/components/Button';
import { useDispatch } from 'react-redux';
import { authenticateAsGuestEffect } from '../../effects';

type Props = Omit<ButtonProps, 'onClick' | 'label'> & {};

export const LogoutButton: React.FC<Props> = ({ ...buttonProps }) => {
  const dispatch = useDispatch();

  return (
    <Box>
      <Button
        label="Log out"
        {...buttonProps}
        onClick={() => {
          dispatch(authenticateAsGuestEffect());
        }}
      />
    </Box>
  );
};
