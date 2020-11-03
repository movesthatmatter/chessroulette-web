import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import logo from 'src/assets/logo_v2.svg';
import {
  AuthenticationConsumer,
  authenticateAsGuestEffect,
} from 'src/services/Authentication';
import { LichessAuthButton } from 'src/services/Authentication/widgets/LichessAuthButton';
import { Menu, Text, Box } from 'grommet';
import { useDispatch } from 'react-redux';

type Props = {};

export const Page: React.FC<Props> = (props) => {
  const cls = useStyles();
  const dispatch = useDispatch();

  return (
    <div className={cls.container}>
      <div className={cls.paddingWrapper}>
        <div className={cls.top}>
          <div className={cls.topMain}>
            <a href="/">
              <img src={logo} alt="logo" className={cls.logo} />
            </a>
          </div>

          <AuthenticationConsumer
            renderAuthenticated={(user) => (
              <Menu
                plain
                dropProps={{ align: { top: 'bottom', left: 'left' } }}
                label={
                  <Text>
                    Welcome <strong>{user.name}</strong>
                  </Text>
                }
                items={[
                  {
                    label: 'Logout',
                    onClick: () => dispatch(authenticateAsGuestEffect()),
                  },
                ]}
              />
            )}
            renderNotAuthenticated={() => (
              <Box alignContent="center" justify="center">
                <LichessAuthButton />
              </Box>
            )}
          />
        </div>
        <main className={cls.main}>{props.children}</main>
      </div>
    </div>
  );
};

const topHeightPx = 60;

const useStyles = createUseStyles({
  container: {
    width: '100%',
    height: '100%',
    background: '#F6F8FB',
  },
  paddingWrapper: {
    padding: '4px 16px',
    height: 'calc(100% - 32px)',
  },
  top: {
    paddingTop: '.6em',
    paddingBottom: '.6em',
    height: `${topHeightPx}px`,
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'space-between',
  },
  topMain: {
    flex: 1,
  },
  topRight: {
    justifySelf: 'flex-end',
  },
  logo: {
    width: '200px',
  },
  main: {
    width: '100%',
    height: `calc(100% - ${topHeightPx}px)`,
  },
});
