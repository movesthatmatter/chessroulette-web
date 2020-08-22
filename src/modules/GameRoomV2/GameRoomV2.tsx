import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { StreamingBox } from 'src/components/StreamingBox';
import { Peer } from 'src/components/RoomProvider';
import { ChessGameV2 } from 'src/modules/Games/Chess/components/ChessGameV2';
import { ChessGameState } from 'src/modules/Games/Chess';
import { GameRoomLayout } from './GameRoomLayout/GameRoomLayout';

type Props = {
  me: Peer;
  opponent: Peer;
  game: ChessGameState | undefined;
};

export const GameRoomV2: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <GameRoomLayout
        getGameComponent={(dimensions) => (
          <ChessGameV2
            homeColor={props.me.id === props.game?.players.black.id ? 'black' : 'white'}
            playable
            game={props.game}
            getBoardSize={() => dimensions.width}
          />
        )}
        getStreamingBoxComponent={(dimensions) => (
          <StreamingBox
            me={props.me}
            peer={props.opponent}
            width={dimensions.width}
          />
        )}
      />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    width: '100%',
    height: '100%',
  },
});
