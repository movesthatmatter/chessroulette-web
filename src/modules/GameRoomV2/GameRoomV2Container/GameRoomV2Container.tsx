import React from 'react';

import { PeerConsumer } from 'src/components/PeerProvider';
import { ChessGameState } from 'src/modules/Games/Chess';
import { Peer } from 'src/components/RoomProvider';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { GameRoomV2 } from '../GameRoomV2';

type Props = & ({
  game: ChessGameState;
  onGameStateUpdate: (nextGame: ChessGameState) => void;
  opponent: Peer;
} | {
  game?: undefined;
})

export const GameRoomV2Container: React.FC<Props> = (props) => (
  <PeerConsumer
    render={(p) => <GameRoomV2 me={p.room.me} {...props} />}
    renderFallback={() => <AwesomeLoaderPage />}
    onReady={(p) => {
      // Show my stream right away for now but later it could be
      // on demand from inside the room
      p.showMyStream();
    }}
  />
);
