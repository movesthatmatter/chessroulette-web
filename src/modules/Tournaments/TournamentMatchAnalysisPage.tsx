import React, { useEffect, useState } from 'react';
import { UserRecord } from 'chessroulette-io';
import {
  TournamentCompleteMatchRecord,
  TournamentInProgressMatchRecord,
} from 'chessroulette-io/dist/resourceCollections/tournaments/records';
import { AwesomeErrorPage } from 'src/components/AwesomeError';
import { useResource } from 'src/lib/hooks/useResource';
import { gameRecordToGame } from '../Games/Chess/lib';
import { findRelayedGameBy } from '../Relay/resources';
import { RelayedGame } from '../Room/RoomActivity/activities/RelayActivity/types';
import { QuickAnalysisRoomPage } from './QuickAnalysisRoomPage/QuickAnalysisRoomPage';

type Props = {
  myUser: UserRecord;
  match: TournamentCompleteMatchRecord | TournamentInProgressMatchRecord;
};

export const TournamentMatchAnalysisPage: React.FC<Props> = ({ myUser, match, ...props }) => {
  const [relayedMatchGame, setRelayedMatchGame] = useState<RelayedGame>();
  const findRelayedGameByResource = useResource(findRelayedGameBy);

  useEffect(() => {
    if (match.state !== 'inProgress') {
      return;
    }

    findRelayedGameByResource
      .request({ gameId: match.gameId })
      .map((r) => ({
        ...r,
        game: gameRecordToGame(r.game),
      }))
      .map(setRelayedMatchGame);
  }, [match?.state]);

  if (match.state === 'complete') {
    return (
      <QuickAnalysisRoomPage
        slug={`${match.slug}-${match.gameId}-${myUser.id}-analysis`}
        analysisActivitySpecs={{
          source: 'archivedGame',
          gameId: match.gameId,
        }}
      />
    );
  }

  if (match.state === 'inProgress' && relayedMatchGame) {
    return (
      <QuickAnalysisRoomPage
        slug={`${match.slug}-${match.gameId}-${myUser.id}-relay`}
        analysisActivitySpecs={{
          source: 'relayedGame',
          relayId: relayedMatchGame.id,
        }}
      />
    );
  }

  return <AwesomeErrorPage errorType="resourceNotFound" />;
};
