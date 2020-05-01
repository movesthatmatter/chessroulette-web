import React, { useState, useEffect, useRef } from 'react';
import { PeerStream } from 'src/services/peer2peer/types';
import { LocalStreamClient } from 'src/services/peer2peer/LocalStreamClient';
import { Peer2PeerProvider } from 'src/components/Peer2Peer';
import { shuffle } from 'src/lib/util';
import { isLeft } from 'fp-ts/lib/Either';
import { PeerMessage } from 'src/services/peer2peer/records/MessagingPayload';
import { GameRoom } from './GameRoom';
import { ChessGameFen, ChessGameState } from '../Games/Chess';
import {
  peerDataRecord, GameUpdateRecord, GameInvitationRecord, GameStartedRecord,
} from './peerDataRecord';

export default {
  component: GameRoom,
  title: 'Modules/GameRoom',
};

const localStreamClient = new LocalStreamClient();

export const mockedPeers = () => React.createElement(() => {
  const [remoteStreams, setRemoteStreams] = useState<PeerStream[]>([]);

  const FakePeers = {
    Kasparov: 'Kasparov',
    Spectator1: 'Spectator1',
  };

  useEffect(() => {
    setTimeout(async () => {
      const stream = await localStreamClient.start();

      setRemoteStreams((prevRemoteStreams) => [
        ...prevRemoteStreams,
        {
          peerId: FakePeers.Kasparov,
          stream,
        },
      ]);
    });

    setTimeout(async () => {
      const stream = await localStreamClient.start();

      setRemoteStreams((prevRemoteStreams) => [
        ...prevRemoteStreams,
        {
          peerId: FakePeers.Spectator1,
          stream,
        },
      ]);
    }, 100);
  }, []);

  return (
    <GameRoom
      currentGame={{
        players: {
          white: {
            name: 'Gabe',
            color: 'white',
          },
          black: {
            name: FakePeers.Kasparov,
            color: 'black',
          },
        },
        fen: undefined,
      }}
      remoteStreams={remoteStreams}
      me="Gabe"
      peers={Object.keys(FakePeers)}
    />
  );
});

export const realDeal = () => React.createElement(() => {
  const [chatHistory, setChatHistory] = useState<PeerMessage[]>([]);
  const [currentGame, setCurrentGame] = useState<ChessGameState | undefined>();
  const p2pProviderRef = useRef<Peer2PeerProvider>(null);

  const getNewChessGame = (betweenPeersById: string[]): ChessGameState => {
    const shuffledPeers = shuffle(betweenPeersById);

    return {
      players: {
        white: {
          name: shuffledPeers[0],
          color: 'white',
        },
        black: {
          name: shuffledPeers[1],
          color: 'black',
        },
      },
      fen: undefined,
    } as const;
  };

  const updateGameStateFen = (fen?: ChessGameFen) => {
    setCurrentGame((prev) => prev && ({
      ...prev,
      fen,
    }));
  };

  return (
    <>
      <Peer2PeerProvider
        ref={p2pProviderRef}
        wssUrl="ws://127.0.0.1:7777"
        // wssUrl="wss://dstnd-server.herokuapp.com"
        iceServersURLs={['stun:stun.ideasip.com']}
        renderLoading={() => (
          <p>Loading Connection...</p>
        )}
        onData={(payload, { sendData, peerStatus }) => {
          try {
            console.log('on peer data', payload);
            const decoded = peerDataRecord.decode(JSON.parse(payload.content));

            if (isLeft(decoded)) {
              console.warn('GameRoom could decode data', payload);
              return;
            }

            const msg = decoded.right;

            if (msg.msgType === 'chatMessage') {
              setChatHistory((prev) => [
                ...prev,
                {
                  // This is a hack to unwrap the content only
                  ...payload,
                  content: msg.content,
                },
              ]);
            } else if (msg.msgType === 'gameInvitation') {
              console.log('game invitation', msg, msg.content.to !== peerStatus.me);
              // If the invitation is not to me return early
              if (msg.content.to !== peerStatus.me) {
                return;
              }

              const newGame = getNewChessGame([msg.content.from, msg.content.to]);

              const whitePlayer = newGame.players.white;
              const blackPlayer = newGame.players.black;


              // Oterwise Accept it right awaiy for now
              const returnMsgPayload: GameStartedRecord = {
                msgType: 'gameStarted',
                gameType: 'chess',
                content: {
                  players: {
                    white: whitePlayer,
                    black: blackPlayer,
                  },
                  fen: newGame.fen,
                },
              };

              // Send the game to the peers
              sendData(JSON.stringify(returnMsgPayload));

              // add update locally too
              setCurrentGame(newGame);
              // send
            } else if (msg.msgType === 'gameStarted') {
              setCurrentGame(msg.content);
            } else if (msg.msgType === 'gameUpdate') {
              updateGameStateFen(msg.content.fen);
            }
          } catch (e) {
            console.warn('GameRoom could NOT parse data', payload);
          }
        }}
        render={({
          remoteStreams,
          peerStatus,
          sendData,
          joinRoom,
          start,
          localStream,
        }) => (
          <>
            {peerStatus.joined_room && localStream ? (
              <GameRoom
              // players={currentGame?.players}
                currentGame={currentGame}
                remoteStreams={Object.values(remoteStreams || {})}
                me={peerStatus.me}
                peers={Object.keys(peerStatus.joined_room.peers)}
                onNewGame={async (peers) => {
                  const msgPayload: GameInvitationRecord = {
                    msgType: 'gameInvitation',
                    gameType: 'chess',
                    content: {
                      from: peers[0],
                      to: peers[1],
                    },
                  };

                  sendData(JSON.stringify(msgPayload));
                }}
                onGameStateUpdate={(fen) => {
                  const msgPayload: GameUpdateRecord = {
                    msgType: 'gameUpdate',
                    gameType: 'chess',
                    content: { fen },
                  };

                  sendData(JSON.stringify(msgPayload));

                  // This should be updated somehow from the state but it's fine for now
                  updateGameStateFen(fen);
                }}
              />
            ) : (
              <>
                {peerStatus.joined_room ? (
                  <div style={{ display: 'flex' }}>
                    <button type="button" onClick={() => start()}>
                      Start RTC
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex' }}>
                    <p>Rooms:</p>
                    {Object.keys(peerStatus.all_rooms).map((room) => (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                        }}
                        key={room}
                      >
                        <button type="button" onClick={() => joinRoom(room)}>
                          Join $
                          {room}
                          {' '}
                          Room
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              </>
            )}
          </>
        )}
      />
    </>

  );
});
