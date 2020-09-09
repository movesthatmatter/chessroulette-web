import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Box } from 'grommet';
import { Button } from 'src/components/Button';
import { useDispatch } from 'react-redux';
import { authenticateAsGuest } from '../../effects';

type Props = {};

export const LogoutButton: React.FC<Props> = () => {
  const dispatch = useDispatch();

  return (
    <Box>
      <Button
        label="Log out"
        onClick={() => {
          dispatch(authenticateAsGuest());
        }}
      />
    </Box>
  );
};

const useStyles = createUseStyles({
  container: {},
});
