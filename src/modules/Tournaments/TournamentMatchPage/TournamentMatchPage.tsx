import React, { useCallback, useEffect, useState } from 'react';
import { RegisteredUserRecord } from 'chessroulette-io';
import { Button } from 'src/components/Button';
import { Page } from 'src/components/Page';
import { RelativeLink } from 'src/components/RelativeLink';
import { createUseStyles } from 'src/lib/jss';
import { JoinedRoomProvider } from 'src/modules/Room/Providers/JoinedRoomProvider';
import { RoomConnectProvider } from 'src/modules/Room/Providers/RoomConnectProvider';
import { ActivityRoomConsumer } from 'src/modules/Room/RoomConsumers/ActivityRoomConsumer';
import { PeerToServerConsumer } from 'src/providers/PeerConnectionProvider';
import { playTournamentMatch } from '../resources';
import { GetRoomOrCreate } from '../room/GetRoomOrCreate';
import { RoomBouncer } from '../room/RoomBouncer';
import { TournamentMatchRecord } from '../types';
import { console } from 'window-or-global';
import { useResource } from 'src/lib/hooks/useResource';
import { canJoinRoom } from 'src/modules/Room/resources';
import { TournamentInProgressMatchPage } from '../TournamentInProgressMatchPage';

type Props = {
  match: TournamentMatchRecord;
  user: RegisteredUserRecord;
};

export const TournamentMatchPage: React.FC<Props> = ({ match: givenMatch, user }) => {
  const cls = useStyles();
  const [match, setMatch] = useState(givenMatch);

  const canJoinRoomResource = useResource(canJoinRoom);

  useEffect(() => {
    setMatch(givenMatch);
  }, [givenMatch]);

  const playMatch = useCallback(() => {
    playTournamentMatch({
      tournamentId: match.tournamentId,
      matchId: match.id,
    }).map((m) => {
      console.log('setting the match', m);

      setMatch(m);
    });
  }, [match]);

  if (match.state === 'inProgress') {
    return <TournamentInProgressMatchPage match={match}/>;
  }

  return (
    <Page name="Tournament Match">
      <pre>{JSON.stringify(match, null, 2)}</pre>
      {match.state == 'underway' && <Button label="Play" onClick={playMatch} />}
      {match.state == 'complete' && <RelativeLink to="/analysis">Analyze</RelativeLink>}
    </Page>
  );
};

const useStyles = createUseStyles({
  container: {},
});
