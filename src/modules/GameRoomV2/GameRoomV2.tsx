import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { StreamingBox } from 'src/components/StreamingBox';
import { Room } from 'src/components/RoomProvider';
import { StandaloneChessGame } from 'src/modules/Games/Chess/components/StandaloneChessGame';
import { ChessGameState, reduceChessGame } from 'src/modules/Games/Chess';
import { Box } from 'grommet';
import { PopupContent } from 'src/components/PopupContent';
import { Modal } from 'src/components/Modal/Modal';
import { PlayButtonWidget } from 'src/components/PlayButtonWidget';
import { GameRoomLayout } from './GameRoomLayout/GameRoomLayout';
import { ChatContainer } from '../ClassRoom/components/Chat';
import { otherChessColor } from '../Games/Chess/util';

type Props = {
  room: Room;
} & ({
  game: ChessGameState;
  onGameStateUpdate: (nextGame: ChessGameState) => void;
} | {
  game?: undefined;
});

export const GameRoomV2: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [showGameFinishedPopup, setShowGameFinishedPopup] = useState(false);

  const homeColor = props.room.me.id === props.game?.players.black.id ? 'black' : 'white';

  const opponent = props.game
    ? props.room.peers[props.game.players[otherChessColor(homeColor)].id]
    : undefined;

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
              && props.game.players[homeColor].id === props.room.me.id
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
        getSideComponent={(dimensions) => (
          <div className={cls.side}>
            <StreamingBox
              room={props.room}
              opponentPeerId={opponent?.id}
              // peer={opponent}
              width={dimensions.width}
            />
            <div className={cls.sideBottom}>
              {!props.game ? (
                <div className={cls.playButtonsContainer}>
                  <PlayButtonWidget type="challenge" />
                  <PlayButtonWidget type="friendly" />
                </div>
              ) : (
                <ChatContainer className={cls.chatContainer} />
              )}
            </div>
          </div>
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
  playButtonsContainer: {
    padding: '1em 0',
  },
  side: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
  },
  sideBottom: {
    flex: 1,
  },
  chatContainer: {
    height: '100%',
    background: 'white',
  },
});
