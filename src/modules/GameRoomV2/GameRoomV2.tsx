import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { StreamingBox } from 'src/components/StreamingBox';
import { Peer } from 'src/components/RoomProvider';
import { StandaloneChessGame } from 'src/modules/Games/Chess/components/StandaloneChessGame';
import { ChessGameState, reduceChessGame } from 'src/modules/Games/Chess';
import { Box } from 'grommet';
import { PopupContent } from 'src/components/PopupContent';
import { Modal } from 'src/components/Modal/Modal';
import { GameRoomLayout } from './GameRoomLayout/GameRoomLayout';

type Props = {
  me: Peer;
  opponent: Peer;
  game: ChessGameState | undefined;
  onGameStateUpdate: (nextGame: ChessGameState) => void;
};

export const GameRoomV2: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [showGameFinishedPopup, setShowGameFinishedPopup] = useState(false);

  const homeColor = props.me.id === props.game?.players.black.id ? 'black' : 'white';

  useEffect(() => {
    if (props.game?.state === 'finished') {
      setShowGameFinishedPopup(true);
    }
  }, [props.game]);

  return (
    <div className={cls.container}>
      <GameRoomLayout
        getGameComponent={(dimensions) => (
          <StandaloneChessGame
            homeColor={homeColor}
            playable={
              (props.game?.state === 'pending' || props.game?.state === 'started')
              && props.game.players[homeColor].id === props.me.id
            }
            game={props.game}
            getBoardSize={() => dimensions.width}
            onMove={(nextPgn) => {
              // don't move unless the game is pending or started
              if (
                !props.game
                || props.game.state === 'finished'
                || props.game.state === 'neverStarted'
              ) {
                return;
              }

              props.onGameStateUpdate(reduceChessGame.move(props.game, { pgn: nextPgn }));
            }}
            onTimerFinished={() => {
              if (
                !props.game
                || props.game.state === 'finished'
                || props.game.state === 'neverStarted'
              ) {
                return;
              }

              props.onGameStateUpdate(reduceChessGame.timerFinished(props.game));
            }}
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
      <Modal
        visible={showGameFinishedPopup}
        onEsc={() => setShowGameFinishedPopup(false)}
        onClickOutside={() => setShowGameFinishedPopup(false)}
      >
        <PopupContent
          hasCloseButton
          onClose={() => setShowGameFinishedPopup(false)}
        >
          <Box>
            {`${props.game?.winner} won`}
          </Box>
        </PopupContent>
      </Modal>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    width: '100%',
    height: '100%',
  },
});
