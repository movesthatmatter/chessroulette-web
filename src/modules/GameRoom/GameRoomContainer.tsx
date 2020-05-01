import React, { useState } from 'react';
import { shuffle } from 'src/lib/util';
import { PeerMessage } from 'src/services/peer2peer/records/PeerMessagingPayload';
import { Peer2PeerProvider } from 'src/components/Peer2Peer';
import { isLeft } from 'fp-ts/lib/Either';
import { Err, Ok, Result } from 'ts-results';
import { ChessGameState, ChessGameFen } from '../Games/Chess';
import { PeerDataRecord, peerDataRecord } from './records/PeerDataRecord';
import { GameStartedRecord } from '../Game/records/GameDataRecord';
import { GameRoom } from './GameRoom';
import { ChatMessageRecord } from './records/ChatDataRecord';


export const decodePeerData = (payload: string): Result<PeerDataRecord, 'BadFormat' | 'BadType'> => {
  try {
    const decoded = peerDataRecord.decode(JSON.parse(payload));

    if (isLeft(decoded)) {
      return new Err('BadType');
    }

    return new Ok(decoded.right);
  } catch (e) {
    return new Err('BadFormat');
  }
};

export const GameRoomContainer: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<PeerMessage[]>([]);
  const [currentGame, setCurrentGame] = useState<ChessGameState | undefined>();

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

  const updateChatHistory = (msg: ChatMessageRecord, envelope: PeerMessage) => {
    setChatHistory((prev) => [
      ...prev,
      {
        // This is a hack to unwrap the content only
        ...envelope,
        content: msg.content,
      },
    ]);
  };

  const updateGameStateFen = (fen?: ChessGameFen) => {
    setCurrentGame((prev) => prev && ({
      ...prev,
      fen,
    }));
  };

  return (
    <Peer2PeerProvider
      // wssUrl="ws://127.0.0.1:7777"
      wssUrl="wss://dstnd-server.herokuapp.com"
      iceServersURLs={['stun:stun.ideasip.com']}
      renderLoading={() => (
        <p>Loading Connection...</p>
      )}
      onPeerMsgSent={(envelope) => {
        decodePeerData(envelope.content).map(
          (msg) => {
            if (msg.msgType === 'chatMessage') {
              updateChatHistory(msg, envelope);
            } else if (msg.msgType === 'gameStarted') {
              setCurrentGame(msg.content);
            } else if (msg.msgType === 'gameUpdate') {
              // Not sure this is good here as the result should be instant
              updateGameStateFen(msg.content.fen);
            }
          },
        );
      }}
      onPeerMsgReceived={(envelope, { sendPeerData, peerStatus }) => {
        decodePeerData(envelope.content).map((msg) => {
          if (msg.msgType === 'chatMessage') {
            updateChatHistory(msg, envelope);
          } else if (msg.msgType === 'gameInvitation') {
            // console.log('game invitation', msg, msg.content.to !== peerStatus.me);
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
            sendPeerData(returnMsgPayload);
          } else if (msg.msgType === 'gameStarted') {
            setCurrentGame(msg.content);
          } else if (msg.msgType === 'gameUpdate') {
            updateGameStateFen(msg.content.fen);
          }
        });
      }}
      render={({
        remoteStreams,
        peerStatus,
        sendPeerData,
        joinRoom,
        start,
        localStream,
      }) => (
        <>
          {peerStatus.joined_room && localStream ? (
            <GameRoom
              me={peerStatus.me}
              peers={Object.keys(peerStatus.joined_room.peers)}
              remoteStreams={Object.values(remoteStreams || {})}
              localStream={localStream}

              chatHistory={chatHistory}
              onNewChatMessage={(content) => {
                sendPeerData({
                  msgType: 'chatMessage',
                  content,
                });
              }}

              currentGame={currentGame}
              onNewGame={(peers) => {
                sendPeerData({
                  msgType: 'gameInvitation',
                  gameType: 'chess',
                  content: peers,
                });
              }}
              onGameStateUpdate={(fen) => {
                sendPeerData({
                  msgType: 'gameUpdate',
                  gameType: 'chess',
                  content: { fen },
                });
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

  );
};
