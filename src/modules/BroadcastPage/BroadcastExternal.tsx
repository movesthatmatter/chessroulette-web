import React, { useEffect, useState } from 'react';
import { Page } from 'src/components/Page';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { Game } from '../Games';
import { LichessBroadcastManager } from './externalAPI/lichess/LichessBroadcastManager';
import { OfficialLichessBroadcastType } from './externalAPI/lichess/types';

type Props = {};

const lichessBroadcastManager = new LichessBroadcastManager();

export const BroadcastExternal: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [broadcasts, setBroadcasts] = useState<OfficialLichessBroadcastType[]>([]);
  const [game, setGame] = useState<Game | null>(null);


  useEffect(() => {
    lichessBroadcastManager.streamCurrentTournamentRound('PJLWuFsr', (game) => {
      setGame(game)
    });
  },[]);

  return (
    <Page title="External Broadcasts" name="External Broadcasts">
      <div className={cls.broadcastList}>
        {broadcasts.map((broadcast) => (
          <div style={{display:'flex', flexDirection:'column', marginBottom: spacers.default}}>
          <div>{broadcast.tour.name}</div>
          <div className={cls.detailsContainer}>
            <div>{broadcast.rounds.map(round => (
              <div>
                {round.id} {round.name} {round.startsAt}
              </div>
            ))}</div>
          </div>
          </div>
        ))}
      </div>
    </Page>
  );
};

const useStyles = createUseStyles({
  container: {},
  broadcastList: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column'
  }
});
