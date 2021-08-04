import React, { useEffect, useState } from 'react';
import { AspectRatio } from 'src/components/AspectRatio';
import { Page } from 'src/components/Page';
import { createUseStyles } from 'src/lib/jss';
import Chessground from 'react-chessground';
import {getInstance as getLichessGameManager, LichessManagerType} from '../LichessGameManager';
import { Button } from 'src/components/Button';
import useInstance from '@use-it/instance';
import { getStartingFen } from 'src/modules/Games/Chess/lib';
import { console } from 'window-or-global';

type Props = {};

export const LichessPage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const lichessManager = useInstance<LichessManagerType>(getLichessGameManager);
  const [fen, setFen] = useState(getStartingFen());

  useEffect(() => {
   lichessManager.startStream();
  },[])

  useEffect(() => {
    console.log('GAME UPDATE!!! - call pubsy ? ')
    lichessManager.onUpdateFen(({fen}) => setFen(fen))
  },[lichessManager.game])

  useEffect(() =>{
    console.log('NEW FEN!', fen);
  },[fen])

  return (
    <Page name='lichess'>
      <AspectRatio aspectRatio={1}>
        <Chessground
          fen={fen}
        />
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