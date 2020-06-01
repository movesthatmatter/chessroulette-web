import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { UserRecord } from 'dstnd-io';
import { Result } from 'ts-results';
import { OnboardingWidget } from './components/OnboardingWidget';

type Props = {
  onSetUser: (
    userInfo: { name: string },
  ) => Promise<Result<UserRecord, unknown>>;
};

export const Onboarding: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <OnboardingWidget />
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
