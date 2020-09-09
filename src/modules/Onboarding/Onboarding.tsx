import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { UserInfoRecord } from 'dstnd-io';
import { Result } from 'ts-results';
import { OnboardingWidget } from './components/OnboardingWidget';

type Props = {
  // TO NOTE: Removed on Sep 8th when I worked on authentication
  // onSetUser: (userId: string) => Promise<Result<UserInfoRecord, unknown>>;
};

export const Onboarding: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      {/* TO NOTE: Removed on Sep 8th when I worked on authentication */}
      {/* <OnboardingWidget /> */}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
