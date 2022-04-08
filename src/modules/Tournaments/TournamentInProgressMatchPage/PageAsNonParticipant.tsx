import React, { useEffect, useState } from 'react';
import { TournamentInProgressMatchRecord } from 'chessroulette-io/dist/resourceCollections/tournaments/records';
import { Page } from 'src/components/Page';
import { useResource } from 'src/lib/hooks/useResource';
import { findRelayedGameBy } from 'src/modules/Relay/resources';
import { ChessGameDisplay } from 'src/modules/Games/widgets/ChessGameDisplay';
import { RelayedGame } from 'src/modules/Room/RoomActivity/activities/RelayActivity/types';
import { gameRecordToGame } from 'src/modules/Games/Chess/lib';
import { RelativeLink } from 'src/components/RelativeLink';

type Props = {
  match: TournamentInProgressMatchRecord;
};

export const PageAsNonParticipant: React.FC<Props> = ({ match }) => {
  const findRelayedGameByResource = useResource(findRelayedGameBy);
  const [relayedGame, setRelayedGame] = useState<RelayedGame>();

  useEffect(() => {
    findRelayedGameByResource
      .request({ gameId: match.gameId })
      .map((r) => ({
        ...r,
        game: gameRecordToGame(r.game),
      }))
      .map(setRelayedGame);
  }, [match.gameId]);

  return (
    <Page name="Tournament Match">
      <pre>{JSON.stringify(match, null, 2)}</pre>
      <div style={{ width: '320px' }}>
        {relayedGame && (
          <RelativeLink to="/analysis">
            <ChessGameDisplay game={relayedGame.game} hoveredText="Watch Live" onClick={() => {}} />
          </RelativeLink>
        )}
      </div>
    </Page>
  );
};
