import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { StreamingBox } from 'src/components/StreamingBox';
import { Peer } from 'src/components/RoomProvider';
import { StandaloneChessGame } from 'src/modules/Games/Chess/components/StandaloneChessGame';
import { ChessGameState, reduceChessGame } from 'src/modules/Games/Chess';
import { Box, Button } from 'grommet';
import { PopupContent } from 'src/components/PopupContent';
import { Modal } from 'src/components/Modal/Modal';
import { GameRoomLayout } from './GameRoomLayout/GameRoomLayout';
import { ChatContainer } from '../ClassRoom/components/Chat';

type Props = {
  me: Peer;
} & ({
  game: ChessGameState;
  onGameStateUpdate: (nextGame: ChessGameState) => void;
  opponent: Peer;
} | {
  game?: undefined;
});

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
        getSideComponent={(dimensions) => (
          <div className={cls.side}>
            <StreamingBox
              me={props.me}
              peer={props.game && props.opponent}
              width={dimensions.width}
            />
            <div className={cls.sideBottom}>
              {!props.game ? (
                <div className={cls.playButtonsContainer}>
                  <Button
                    type="button"
                    primary
                    fill
                    className={cls.button}
                    size="large"
                    label="Play a Friend"
                  />
                  <Button
                    type="button"
                    primary
                    fill
                    size="large"
                    className={cls.button}
                    label="Play a Rando"
                  />
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
  button: {
    marginBottom: '1.5em',
    '&:hover': {
      opacity: 0.8,
    },
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
    // border: '1px solid #ccc',
    height: '100%',
    background: 'white',
  },
});
