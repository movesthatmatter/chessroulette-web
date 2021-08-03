import React, { useEffect, useReducer } from 'react';
import { AspectRatio } from 'src/components/AspectRatio';
import { Page } from 'src/components/Page';
import { createUseStyles } from 'src/lib/jss';
import Chessground from 'react-chessground';
import {getInstance as getLichessGameManager} from '../LichessGameManager';
import { Button } from 'src/components/Button';

type Props = {};

export const LichessPage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [_, redraw] = useReducer(s => s+1, 0);
  const lichessManager = getLichessGameManager(redraw);
  useEffect(() => {
   lichessManager.startStream();
  },[])

  return (
    <Page name='lichess'>
      <AspectRatio aspectRatio={1}>
        <Chessground/>
          <Button label='Challenge' onClick={() => {
            lichessManager.sendChallenge();
          }}
          />
      </AspectRatio>
    </Page>
  );
};

const useStyles = createUseStyles({
  container: {},
});