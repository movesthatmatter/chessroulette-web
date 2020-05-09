import React, { useState, useEffect } from 'react';
import { shuffle } from 'src/lib/util';
import { PeerRecord, RoomStatsRecord } from 'dstnd-io';
import { SocketConsumer } from 'src/components/SocketProvider';
import { PeersProvider } from 'src/components/PeersProvider';
import { eitherToResult } from 'src/lib/ioutil';
import { ChatMessageRecord, chatMessageRecord } from 'src/components/ChatBox/records/ChatMessageRecord';
import * as io from 'io-ts';
import {

  ChessPlayers,
  ChessGameFen,
  ChessPlayer,
  ChessGameState,
} from '../Games/Chess';
import { GameRoom } from './GameRoom';
import {
  GameInvitationRecord,
  GameDataRecord,
  gameDataRecord,
  GameStartedRecord,
} from './records/GameDataRecord';

type Props = {
  me: PeerRecord;
  room: RoomStatsRecord;
};

type ChessPlayersByName = Record<string, ChessPlayer>;

const chessPlayersByName = (players: ChessPlayers): ChessPlayersByName => ({
  [players.white.name]: players.white,
  [players.black.name]: players.black,
});

export const GameRoomContainer: React.FC<Props> = (props) => {
  const [chatHistory, setChatHistory] = useState<ChatMessageRecord[]>([]);
  const [currentGame, setCurrentGame] = useState<ChessGameState | undefined>();
  const [
    playersByName,
    setPlayersByName,
  ] = useState<ChessPlayersByName | undefined>(
    currentGame
      ? chessPlayersByName(currentGame.players)
      : undefined,
  );

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
    setCurrentGame(
      (prev) =>
        prev && {
          ...prev,
          fen,
        },
    );
  };

  useEffect(() => {
    if (currentGame) {
      setPlayersByName(chessPlayersByName(currentGame.players));
    } else {
      setPlayersByName(undefined);
    }
  }, [currentGame?.players]);

  const handleMessages = (payload: unknown) => {
    eitherToResult(io.union([gameDataRecord, chatMessageRecord]).decode(payload)).map((msg) => {
      if (msg.msgType === 'gameStarted') {
        setCurrentGame(msg.content);
      } else if (msg.msgType === 'gameUpdate') {
        updateGameStateFen(msg.content.fen);
      } else if (msg.msgType === 'chatMessage') {
        setChatHistory((prev) => [...prev, msg]);
      }
    });
  };

  return (
    <SocketConsumer
      render={({ socket }) => (
        <PeersProvider
          me={props.me}
          peers={Object.values(props.room.peers)}
          socket={socket}
          onReady={({ connect }) => connect()}
          onPeerMsgSent={(envelope) => handleMessages(envelope.message)}
          onPeerMsgReceived={(envelope, { broadcastMessage }) => {
            handleMessages(envelope.message);

            eitherToResult(gameDataRecord.decode(envelope.message))
              .map((msg) => {
                if (msg.msgType === 'gameInvitation') {
                  // If the invitation is not to me return early
                  if (msg.content.challengee !== props.me.id) {
                    return;
                  }

                  const newGame = getNewChessGame([
                    msg.content.challenger,
                    msg.content.challengee,
                  ]);

                  const whitePlayer = newGame.players.white;
                  const blackPlayer = newGame.players.black;

                  // Otherwise Accept it right away for now
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
                  broadcastMessage(returnMsgPayload);
                }
              });
          }}
          render={({
            broadcastMessage,
            startAVBroadcasting,
            stopAVBroadcasting,
            localStream,
            peerConnections,
          }) => (
            <GameRoom
              me={props.me}
              peerConnections={Object.values(peerConnections)}
              // Streaming
              startStreaming={startAVBroadcasting}
              stopStreaming={stopAVBroadcasting}
              localStream={localStream}
              // Game
              currentGame={currentGame}
              playersByName={playersByName}
              onNewGame={(opponents) => {
                const payload: GameInvitationRecord = {
                  msgType: 'gameInvitation',
                  gameType: 'chess',
                  content: opponents,
                };

                broadcastMessage(payload);
              }}
              onGameStateUpdate={(fen) => {
                const payload: GameDataRecord = {
                  msgType: 'gameUpdate',
                  gameType: 'chess',
                  content: { fen },
                };

                broadcastMessage(payload);
              }}
              // Chat
              chatHistory={chatHistory}
              broadcastMessage={broadcastMessage}
            />
          )}
        />
      )}
    />
  );
};
