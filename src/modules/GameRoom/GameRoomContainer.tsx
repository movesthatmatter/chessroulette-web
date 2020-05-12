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

type ChessPlayersById = Record<string, ChessPlayer>;

const getPlayersById = (players: ChessPlayers): ChessPlayersById => ({
  [players.white.id]: players.white,
  [players.black.id]: players.black,
});

export const GameRoomContainer: React.FC<Props> = (props) => {
  const [chatHistory, setChatHistory] = useState<ChatMessageRecord[]>([]);
  const [currentGame, setCurrentGame] = useState<ChessGameState | undefined>();
  const [
    playersById,
    setPlayersById,
  ] = useState<ChessPlayersById | undefined>(
    currentGame
      ? getPlayersById(currentGame.players)
      : undefined,
  );

  const getNewChessGame = (playerIds: string[]): ChessGameState => {
    const [whitePlayerId, blackPlayerId] = shuffle(playerIds);

    return {
      players: {
        white: {
          name: props.room.peers[whitePlayerId]?.name,
          id: whitePlayerId,
          color: 'white',
        },
        black: {
          name: props.room.peers[blackPlayerId]?.name,
          id: blackPlayerId,
          color: 'black',
        },
      },
      pgn: undefined,
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
      setPlayersById(getPlayersById(currentGame.players));
    } else {
      setPlayersById(undefined);
    }
  }, [currentGame?.players]);

  const handleMessages = (payload: unknown) => {
    eitherToResult(io.union([gameDataRecord, chatMessageRecord]).decode(payload)).map((msg) => {
      if (msg.msgType === 'gameStarted') {
        setCurrentGame(msg.content);
      } else if (msg.msgType === 'gameUpdate') {
        updateGameStateFen(msg.content.pgn);
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
          onReady={({ connect, startAVBroadcasting }) => {
            connect();

            setTimeout(startAVBroadcasting, 3 * 1000);
          }}
          onPeerMsgSent={(envelope) => handleMessages(envelope.message)}
          onPeerMsgReceived={(envelope, { broadcastMessage }) => {
            handleMessages(envelope.message);

            eitherToResult(gameDataRecord.decode(envelope.message))
              .map((msg) => {
                if (msg.msgType === 'gameInvitation') {
                  // If the invitation is not to me return early
                  if (msg.content.challengeeId !== props.me.id) {
                    return;
                  }

                  const newGame = getNewChessGame([
                    msg.content.challengerId,
                    msg.content.challengeeId,
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
                      pgn: newGame.pgn,
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
              room={props.room}
              peerConnections={peerConnections}
              // Streaming
              startStreaming={startAVBroadcasting}
              stopStreaming={stopAVBroadcasting}
              localStream={localStream}
              // Game
              currentGame={currentGame}
              playersById={playersById}
              onNewGame={(players) => {
                const payload: GameInvitationRecord = {
                  msgType: 'gameInvitation',
                  gameType: 'chess',
                  content: players,
                };

                broadcastMessage(payload);
              }}
              onGameStateUpdate={(pgn) => {
                const payload: GameDataRecord = {
                  msgType: 'gameUpdate',
                  gameType: 'chess',
                  content: { pgn },
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
