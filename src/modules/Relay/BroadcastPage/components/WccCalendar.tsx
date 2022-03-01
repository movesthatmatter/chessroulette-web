import { RelayedGameRecord } from 'chessroulette-io/dist/resourceCollections/relay/records';
import React, { useEffect, useState } from 'react';
import { Text } from 'src/components/Text';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { createUseStyles } from 'src/lib/jss';
import { TournamentRoundMocker } from 'src/mocks/records/TournamentRoundMocker';
import { usePeerStateClient } from 'src/providers/PeerProvider';
import { SocketClient } from 'src/services/socket/SocketClient';
import { spacers } from 'src/theme/spacers';
import { console, Date } from 'window-or-global';
import { TournamentRound } from '../types';
import { BroadcastGameItem } from './BroadcastGameItem';

type Props = {};
const tournamentRoundMocker = new TournamentRoundMocker();

export const WccCalendar: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [selectedRound, setSelectedRound] = useState<string | null>(null);
  const [rounds, setRounds] = useState<TournamentRound[]>(
    new Array(14)
      .fill(null)
      .map((_, index) =>
        tournamentRoundMocker.record(
          index < 6 ? 'ended' : index === 6 ? 'started' : 'pending',
          `WCC - Game ${index + 1}`
        )
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .sort((a, b) => {
        if (a.relay.gameState === 'started') {
          if (b.relay.gameState === 'started') {
            return 0;
          }
          return -1;
        }
        return 1;
      })
  );

  const peerState = usePeerStateClient();

  const request: SocketClient['send'] = (payload) => {
    peerState.send(payload);
  };

  const onLoadGame = (r: RelayedGameRecord) => {};

  const onWatchGame = (r: RelayedGameRecord) => {
    // request({
    //   kind: 'analysisImportRelayedGameRequest',
    //   content: {
    //     // id: props.activity.analysisId,
    //     relayedGameId: r.id,
    //   },
    // });
  };

  useEffect(() => {
    console.log('rounds', rounds);
  }, [rounds]);

  return (
    <div className={cls.container}>
      <Text size="subtitle2">WCC 2021 Schedule</Text>
      <div style={{ height: spacers.large }} />
      {rounds.map((round) => (
        <BroadcastGameItem
          round={round}
          active={selectedRound === round.id}
          setActive={(id) => setSelectedRound(id)}
          setDeactive={() => setSelectedRound(null)}
          onLoadGame={onLoadGame}
          onWatchNow={onWatchGame}
        />
      ))}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
});
