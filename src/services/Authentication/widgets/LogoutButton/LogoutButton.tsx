import React from 'react';
import { Box } from 'grommet';
import { Button, ButtonProps } from 'src/components/Button';
import { useHistory } from 'react-router-dom';
import { useAuthenticationService } from '../../useAuthentication';

type Props = Omit<ButtonProps, 'onClick' | 'label'> & {};

export const LogoutButton: React.FC<Props> = ({ ...buttonProps }) => {
  const history = useHistory();
  const authenticationService = useAuthenticationService();

  return (
    <Box>
      <Button
        label="Log out"
        {...buttonProps}
        onClick={() => {
          authenticationService.remove();
          history.replace('/');
        }}
      />
    </Box>
  );
};
