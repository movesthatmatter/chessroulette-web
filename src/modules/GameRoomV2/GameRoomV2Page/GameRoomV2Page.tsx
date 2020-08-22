import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Page } from 'src/components/Page/Page';
import { GameRoomV2 } from '../GameRoomV2';

type Props = {};

export const GameRoomV2Page: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <Page>
      {/* <GameRoomV2 /> */}
    </Page>
  );
};

const useStyles = createUseStyles({
  container: {},
});
