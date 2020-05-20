import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { PeerMessageEnvelope } from 'src/services/peers';
import { ChatBoxContainer } from 'src/components/ChatBox';
import { ChatMessageRecord } from 'src/components/ChatBox/records/ChatMessageRecord';
import logo from 'src/assets/logo_black.svg';
import cx from 'classnames';
import { RoomInfoDisplay } from 'src/components/RoomInfoDisplay';
import { PopupModal } from 'src/components/PopupModal/PopupModal';
import { PopupContent } from 'src/components/PopupContent';
import { Room, Peer } from 'src/components/RoomProvider';
import { MutunachiProps, Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import useWindowSize from '@react-hook/window-size';
import {
  ChessGame,
  ChessPlayer,
  ChessGameState,
  reduceChessGame,
} from '../Games/Chess';
import { PlayerBox } from './components/PlayerBox/PlayerBox';
import { otherChessColor } from '../Games/Chess/util';
import { GameChallengeRecord } from './records/GameDataRecord';
import { ChallengeOfferPopup } from './components/ChallengeOfferPopup';
import { getBoardSize } from './util';

export type GameRoomProps = {
  me: Peer;
  room: Room;

  // Game
  onChallengeOffer: (challenge: GameChallengeRecord) => void;
  onChallengeAccepted: (challenge: GameChallengeRecord) => void;
  onChallengeRefused: (challenge: GameChallengeRecord) => void;
  onChallengeCancelled: (challenge: GameChallengeRecord) => void;
  challengeOffer?: GameChallengeRecord;

  currentGame: ChessGameState | undefined;
  // onNewGame: (players: { challengerId: string; challengeeId: string }) => void;
  onGameStateUpdate: (nextState: ChessGameState) => void;

  // Streaming
  startStreaming: () => void;
  stopStreaming: () => void;

  // Chat
  // The GameRoom shouldn't have to handle the state and know the intricacies
  //  of the chat system, instead it only passes the generic broadcast method further
  //  In the future, the ChatBoxContainer can access it directly from the PeersProvider
  //  via context
  chatHistory: ChatMessageRecord[];
  broadcastMessage: (msg: PeerMessageEnvelope['message']) => void;
};

type ChessPlayersById = Record<string, ChessPlayer>;

// Memoize this to make it faster if needed
const getPlayersById = (
  gameState: ChessGameState | undefined,
): ChessPlayersById => {
  if (!gameState) {
    return {};
  }

  return {
    [gameState.players.white.id]: gameState.players.white,
    [gameState.players.black.id]: gameState.players.black,
  };
};

type PopupTypesMap = {
  none: undefined;
  challengeOffer: GameChallengeRecord;
}

export const GameRoom: React.FC<GameRoomProps> = ({
  me,
  room,
  ...props
}) => {
  const cls = useStyles();
  const [lastMoveTime, setLastMoveTime] = useState<Date | undefined>();
  const [showingPopup, setShowingPopup] = useState<Partial<PopupTypesMap>>({ none: undefined });
  const [playable, setPlayable] = useState(false);
  const [screenWidth, screenHeight] = useWindowSize();

  const boardSize = getBoardSize({ screenWidth, screenHeight });

  const playersById = props.currentGame
    ? getPlayersById(props.currentGame)
    // If there is no game in progress set me as the initial player
    : {
      [me.id]: {
        id: me.id,
        name: me.name,
        color: 'white',
      } as const,
    };

  const homeColor = (playersById[me.id] && playersById[me.id].color) || 'white';
  const awayColor = otherChessColor(homeColor);

  const playerHomeAsPeer = props.currentGame
    ? room.peers[props.currentGame.players[homeColor].id] || me
    : me;
  const playerAwayAsPeer = props.currentGame
    ? room.peers[props.currentGame.players[awayColor].id]
    : null;

  useEffect(() => {
    setPlayable(() => {
      if (!props.currentGame) {
        return false;
      }

      // The game is playable only if ME is a player and it's ME's turn
      return !!playersById[me.id] && props.currentGame.lastMoved !== playersById[me.id].color;
    });
  }, [props.currentGame]);

  useEffect(() => {
    if (props.challengeOffer) {
      // If we get a challenge offer show the popup
      setShowingPopup({ challengeOffer: props.challengeOffer });
    } else if (showingPopup.challengeOffer) {
      // If the offer gets removed, and the popup is still on, hide it
      setShowingPopup({ none: undefined });
    }
  }, [props.challengeOffer]);

  return (
    <div className={cls.container}>
      <div className={cls.paddingWrapper}>
        <div className={cls.top}>
          <img src={logo} alt="logo" className={cls.logo} />
        </div>
        <main className={cls.grid}>
          <aside className={cx(cls.leftSide)}>
            <div
              className={cls.playersContainer}
              style={{ width: boardSize / 2 }}
            >
              {props.currentGame && playerAwayAsPeer ? (
                <PlayerBox
                  className={cx(cls.playerBox, cls.playerBoxAway)}
                  currentGame={props.currentGame}
                  onTimeFinished={() => {
                    if (
                      !props.currentGame
                    || props.currentGame.state === 'finished'
                    || props.currentGame.state === 'neverStarted'
                    ) {
                      return;
                    }
                    props.onGameStateUpdate(
                      reduceChessGame.timerFinished(props.currentGame, {
                        loser: awayColor,
                      }),
                    );
                  }}
                  player={props.currentGame.players[awayColor]}
                  avatarId={playerAwayAsPeer.avatarId}
                  side="away"
                  streamConfig={playerAwayAsPeer.connection.channels.streaming}
                />
              ) : (
                <div className={cx(cls.playerBox, cls.playerBoxAway, cls.noPlayerFallback)}>
                  <div className={cls.awayTitle}>
                    <span style={{ fontWeight: 'bold', fontSize: '24px' }}>Game not started.</span>
                    <br />
                    Challenge one of your friends to start a game.
                  </div>
                  {/* <Mutunachi
                    mid={0}
                    style={{ height: '10%' }}
                  /> */}
                </div>

              )}
              <PlayerBox
                className={cx(cls.playerBox, cls.playerBoxHome)}
                currentGame={props.currentGame}
                onTimeFinished={() => {
                  if (
                    !props.currentGame
                  || props.currentGame.state === 'finished'
                  || props.currentGame.state === 'neverStarted'
                  ) {
                    return;
                  }

                  props.onGameStateUpdate(
                    reduceChessGame.timerFinished(props.currentGame, {
                      loser: homeColor,
                    }),
                  );
                }}
                player={
                props.currentGame?.players[homeColor] ?? {
                    ...me,
                    color: 'white',
                  }
                }
                avatarId={playerHomeAsPeer.avatarId}
                side="home"
                streamConfig={playerHomeAsPeer.connection.channels.streaming}
                // Mute it if it's my stream so it doesn't createa a howling effect
                muted={playerHomeAsPeer.id === me.id}
              />
            </div>
          </aside>
          <div className={cls.middleSide}>
            <ChessGame
              className={cls.gameContainer}
              pgn={props.currentGame?.pgn ?? ''}
              homeColor={homeColor}
              playable={playable}
              onMove={(nextPgn) => {
                // don't move unles the game is pending or started
                if (
                  !props.currentGame
                  || props.currentGame.state === 'finished'
                  || props.currentGame.state === 'neverStarted'
                ) {
                  return;
                }

                const now = new Date();

                const nextGame = reduceChessGame.move(props.currentGame, {
                  pgn: nextPgn,
                  msSinceLastMove:
                    typeof lastMoveTime === 'undefined'
                      ? 0
                      : now.getTime() - lastMoveTime.getTime(),
                });

                setLastMoveTime(now);

                props.onGameStateUpdate(nextGame);
              }}
            />
          </div>
          <aside className={cls.rightSide}>
            <RoomInfoDisplay
              me={me}
              room={room}
              playersById={playersById}
              gameInProgress={
                !!props.currentGame
                && (props.currentGame.state === 'pending'
                  || props.currentGame.state === 'started')
              }
              onChallenge={(challengeOffer) => {
                props.onChallengeOffer(challengeOffer);
              }}
            />
            <div className={cls.chatWrapper}>
              <ChatBoxContainer
                me={me}
                broadcastMessage={(...args) => {
                  props.broadcastMessage(...args);
                }}
                chatHistory={props.chatHistory}
              />
            </div>
          </aside>
        </main>
      </div>

      <PopupModal show={!!showingPopup.challengeOffer}>
        <PopupContent>
          {showingPopup.challengeOffer && (
            <ChallengeOfferPopup
              challengeOffer={showingPopup.challengeOffer}

              meId={room.me.id}
              challengee={room.peersIncludingMe[showingPopup.challengeOffer.challengeeId]}
              challenger={room.peersIncludingMe[showingPopup.challengeOffer.challengerId]}

              onAccepted={props.onChallengeAccepted}
              onRefused={props.onChallengeRefused}
              onCancelled={props.onChallengeCancelled}
            />
          )}
        </PopupContent>
      </PopupModal>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    width: '100%',
    height: '100%',
    background: '#F1F1F1',
    position: 'relative',
    fontFamily: 'Open Sans',
    fontSize: '16px',
  },
  paddingWrapper: {
    padding: '4px 16px',
    height: 'calc(100% - 16px)',
  },
  top: {
    paddingBottom: '16px',
  },
  logo: {
    width: '200px',
  },
  bottom: {},
  grid: {
    display: 'flex',
    flexDirection: 'row',
  },
  playersContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    flex: 1,
  },
  playerBox: {
    width: '100%',
    flex: 1,
    textAlign: 'center',
  },
  playerBoxHome: {},
  playerBoxAway: {},
  noPlayerFallback: {
    // display: 'flex',
    // flexDirection: 'column',
    // justifyContent: 'center',
  },
  playerStreamFallback: {
    textAlign: 'center',
  },
  playerCharacter: {
    width: '40p%',
    textAlign: 'center',
  },
  leftSide: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-end',
  },
  middleSide: {
    margin: '0 16px',
  },
  gameContainer: {},
  rightSide: {
    flex: 1,
  },
  chatWrapper: {
    position: 'absolute',
    bottom: 0,
    zIndex: 99,
    right: '16px',
  },
  awayTitle: {
    textAlign: 'center',
    backgroundColor: '#E3E3E3',
    color: '#F7627B',
    padding: '8px',
    borderRadius: '14px',
    width: 'fit-content',
  },
});
