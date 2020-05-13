import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { PeerMessageEnvelope } from 'src/services/peers';
import { PeerRecord, RoomStatsRecord } from 'dstnd-io';
import { FaceTime } from 'src/components/FaceTimeArea/FaceTime';
import { ChatBoxContainer } from 'src/components/ChatBox';
import { ChatMessageRecord } from 'src/components/ChatBox/records/ChatMessageRecord';
import { PeerConnections } from 'src/components/PeersProvider';
import logo from 'src/assets/logo_black.svg';
import cx from 'classnames';
import { complement } from 'src/lib/util';
import { RoomInfoDisplay } from 'src/components/RoomInfoDisplay';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import {
  ChessGame,
  ChessPlayers,
  ChessPlayer,
  ChessGameState,
} from '../Games/Chess';
import { Coundtdown } from './components/Countdown';


export type GameRoomProps = {
  me: PeerRecord;
  room: RoomStatsRecord;
  peerConnections: PeerConnections;

  // Game
  playersById: Record<string, ChessPlayer> | undefined;
  currentGame: ChessGameState;
  onNewGame: (players: { challengerId: string; challengeeId: string }) => void;
  onGameStateUpdate: (nextState: ChessGameState) => void;

  // Streaming
  startStreaming: () => void;
  stopStreaming: () => void;
  localStream: MediaStream | void;

  // Chat
  // The GameRoom shouldn't have to handle the state and know the intricacies
  //  of the chat system, instead it only passes the generic broadcast method further
  //  In the future, the ChatBoxContainer can access it directly from the PeersProvider
  //  via context
  chatHistory: ChatMessageRecord[];
  broadcastMessage: (msg: PeerMessageEnvelope['message']) => void;
};

const unknownPlayers: ChessPlayers = {
  white: {
    name: 'Unknown',
    color: 'white',
    id: '-1',
  },
  black: {
    name: 'Unknown',
    color: 'black',
    id: '-2',
  },
};

const chessColors = ['white', 'black'] as const;

export const GameRoom: React.FC<GameRoomProps> = ({
  me,
  peerConnections,
  playersById,
  ...props
}) => {
  const cls = useStyles();

  const homeColor = (playersById && playersById[me.id] && playersById[me.id].color) || 'white';
  const awayColor = complement(homeColor, chessColors);
  const playable = !!(playersById && !!playersById[me.id]);

  const playerHomeId = props.currentGame
    ? props.currentGame.players[homeColor].id
    : me.id;
  const playerAwayId = props.currentGame
    ? props.currentGame.players[awayColor].id
    : null;
  const [lastMoveTimestamp, setLastMoveTimestamp] = useState(new Date().getTime());

  return (
    <div className={cls.container}>
      <div className={cls.paddingWrapper}>
        <div className={cls.top}>
          <img src={logo} alt="logo" className={cls.logo} />
        </div>
        <main className={cls.grid}>
          <aside className={cls.leftSide}>
            <div className={cls.playersContainer}>
              <div className={cx([cls.playerBox, cls.playerAway])}>
                <div className={cls.peerBoxContainer}>
                  {playerAwayId ? (
                    <>
                      <div>
                        <h4>{props.room.peers[playerAwayId].name}</h4>
                        <Coundtdown
                          timeLeft={props.currentGame?.timeLeft?.[awayColor] ?? 0}
                          paused={props.currentGame?.lastMoved === awayColor}
                        />
                      </div>
                      <div className={cls.peerBox}>
                        <FaceTime
                          streamConfig={
                            peerConnections[playerAwayId].channels.streaming
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <div className={cls.playerStreamFallback}>
                      <Mutunachi mid={0} className={cls.playerCharacter} />
                      {/* <div>Waiting for Opponent</div> */}
                    </div>
                  )}
                </div>
              </div>
              <div className={cx([cls.playerBox, cls.playerHome])}>
                <div className={cls.peerBoxContainer}>
                  {props.localStream ? (
                    <div className={cls.peerBox}>
                      <FaceTime
                        // This should come straight from localStreamClient
                        streamConfig={{
                          on: true,
                          stream: props.localStream,
                          type: 'audio-video',
                        }}
                      />
                    </div>
                  ) : (
                    <div className={cls.playerStreamFallback}>
                      <Mutunachi mid={4} className={cls.playerCharacter} />
                    </div>
                  )}

                  {/* {!props.currentGame && (
                    <button
                      type="button"
                      onClick={() => props.onNewGame({
                        challengee: pc.peerId,
                        challenger: me.id,
                      })}
                    >
                      {`Challenge ${pc.peerId}`}
                    </button>
                  )} */}
                  {/* </div> */}
                  <div>
                    <Coundtdown
                      timeLeft={props.currentGame?.timeLeft?.[homeColor] ?? 0}
                      paused={props.currentGame?.lastMoved === homeColor}
                    />
                    <h4>{props.room.peers[playerHomeId].name}</h4>
                  </div>
                </div>
              </div>
              {
                // peerConnections.map((pc) => (
                //   <div className={cls.peerBoxContainer}>
                //     <div
                //       className={cls.peerBox}
                //       key={pc.peerId}
                //     >
                //       <FaceTime
                //         streamConfig={pc.channels.streaming}
                //       />
                //       {/* {!props.currentGame && (
                //       <button
                //         type="button"
                //         onClick={() => props.onNewGame({
                //           challengee: pc.peerId,
                //           challenger: me.id,
                //         })}
                //       >
                //         {`Challenge ${pc.peerId}`}
                //       </button>
                //     )} */}
                //     </div>
                //   </div>
                // ))
              }
            </div>
          </aside>
          <div className={cls.middleSide}>
            <ChessGame
              className={cls.gameContainer}
              players={props.currentGame?.players || unknownPlayers}
              pgn={props.currentGame?.pgn ?? ''}
              homeColor={homeColor}
              playable={playable}
              allowSinglePlayerPlay
              onMove={(next) => {
                if (props.currentGame) {
                  const currentMovedColor = props.currentGame.lastMoved === 'white' ? 'black' : 'white';
                  // get only seconds the smaller bit for now

                  const now = new Date().getTime();
                  const secondsSinceLastMoved = now - lastMoveTimestamp;

                  setLastMoveTimestamp(now);

                  props.onGameStateUpdate({
                    ...props.currentGame,
                    pgn: next,
                    lastMoved: currentMovedColor,
                    ...(props.currentGame.timeLeft && {
                      timeLeft: {
                        ...props.currentGame.timeLeft,
                        [currentMovedColor]:
                          props.currentGame.timeLeft[currentMovedColor]
                          - secondsSinceLastMoved,
                      },
                    }),
                  });
                }
              }}
            />
          </div>
          <aside className={cls.rightSide}>
            <RoomInfoDisplay
              me={me}
              room={props.room}
            />
            <div>
              {props.room.type === 'private' && (
                <div>{`Invite Friends: ${props.room.code}`}</div>
              )}
            </div>
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
      {/* <div className={cls.bottom}>
        <div className={cls.chatWrapper}>

        </div>
      </div> */}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    width: '100%',
    height: '100%',
    background: '#efefef',
    position: 'relative',
  },
  paddingWrapper: {
    padding: '4px 16px',
    height: 'calc(100% - 16px)',
  },
  top: {
    // paddingTop: '16px',
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
    // background: 'red',
    height: '100%',
    border: '1px solid #dedede',

    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    // background: 'red',
    alignItems: 'baseline',
    // justifyContent: 'middle',
  },
  playerBox: {
    width: '100%',
    flex: 1,
    // alignSelf: 'flex-end',
    // background: 'red',
    textAlign: 'center',
  },
  playerStreamFallback: {
    textAlign: 'center',
  },
  playerCharacter: {
    width: '40p%',
    textAlign: 'center',
  },
  playerAway: {
    // background: 'red',
    // verticalAlign: 'bottom',
    display: 'flex',
    width: '100%',
    alignItems: 'flex-end',
    // borderBottom: '6px solid #272729',
    paddingBottom: '8px',
  },
  playerHome: {
    paddingTop: '8px',
    // background: 'green',
    // borderTop: '6px solid #272729',
  },

  peerBoxContainer: {
    display: 'block',
    width: '100%',
    // width: '50%',
    // order: 3,
    // flex: 1,
    textAlign: 'right',
  },
  peerBox: {
    // paddingTop: '16px',
    // '&:first-child': {
    //   paddingTop: '0px',
    // },
    // width: 10
    maxWidth: '320px',
    // maxHeight: '50%',

    display: 'flex',
    margin: '0 0 0 auto',
    // alignItems: 'flex-end',
    // justifyContent: 'flex-end',
    // justifyItems: 'flex-end',
    // textAlign: 'center',
    // margin: '0 auto',
    // background: 'green',
  },
  // gameRoomContainer: {
  //   zIndex: 1,
  //   position: 'absolute',
  //   height: '100%',
  //   width: '100%',
  //   top: '0',
  //   left: '0',
  // },
  // contentContainer: {
  //   display: 'flex',
  //   flexDirection: 'row',
  //   zIndex: 1,
  //   position: 'relative',
  // },
  spacer: {
    width: '100%',
  },

  leftSide: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    // paddingRight: '16px',

    // background: 'red',
  },
  middleSide: {
    // flex: 1,
    // background: '#efefef',
    // alignContent: 'center',
    // alignItems: 'center',
    border: '#ddd 1px solid',
    margin: '0 16px',
  },
  gameContainer: {
    // margin: '0 auto',
    // background: 'red',
  },
  rightSide: {
    flex: 1,
    // background: 'red',
  },
  challengeButton: {
    padding: '10px',
    backgroundColor: 'rgb(8, 209, 131)',
  },
  peersContainer: {},
  avStreamContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  avStream: {
    width: '100%    !important',
    maxWidth: '420px !important',
    height: 'auto   !important',
  },
  myAvStream: {},
  gameWrapper: {
    position: 'relative',
    zIndex: 1,
  },
  chatWrapper: {
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
    right: '16px',
  },

});
