import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { PeerProvider } from 'src/components/PeerProvider';

type Props = {};

export const GameRoomV2Container: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <PeerProvider>
      <div className={cls.container}>
        works
      </div>
    </PeerProvider>
  );
};

const useStyles = createUseStyles({
  container: {},
});
