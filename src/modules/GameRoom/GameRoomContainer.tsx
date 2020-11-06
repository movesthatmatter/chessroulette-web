import React, { useState } from 'react';
import { eitherToResult } from 'src/lib/ioutil';
import {
  ChatMessageRecord,
  chatMessageRecord,
} from 'src/components/ChatBox/records/ChatMessageRecord';
import * as io from 'io-ts';
import { RoomProvider } from 'src/components/RoomProvider';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { ChessGameState, reduceChessGame } from '../Games/Chess';
import { GameRoom } from './GameRoom';
import {
  GameDataRecord,
  gameDataRecord,
  GameStartedRecord,
  GameChallengeOfferRecord,
  GameChallengeRefusedRecord,
  GameChallengeCancelledRecord,
} from './records/GameDataRecord';

type Props = {
  id: string;
  code?: string;
};

export const GameRoomContainer: React.FC<Props> = (props) => {
  const [chatHistory, setChatHistory] = useState<ChatMessageRecord[]>([]);
  const [currentGame, setCurrentGame] = useState<ChessGameState | undefined>();
  const [
    challengeOffer,
    setChallengeOffer,
  ] = useState<GameChallengeOfferRecord | undefined>();

  const handleMessages = (payload: unknown) => {
    eitherToResult(
      io.union([gameDataRecord, chatMessageRecord]).decode(payload),
    ).map((msg) => {
      if (msg.msgType === 'gameStarted') {
        setChallengeOffer(undefined);
        setCurrentGame(msg.content);
      } else if (msg.msgType === 'gameUpdate') {
        setCurrentGame(msg.content);
      } else if (msg.msgType === 'chatMessage') {
        setChatHistory((prev) => [...prev, msg]);
      } else if (msg.msgType === 'gameChallengeOffer') {
        // If the invitation is not to me return early
        // if (msg.content.challengeeId !== props.me.id) {
        //   return;
        // }

        // Note: Took it out on Sept 2 after a huge refactoing on GameRoomV2
        //  and this broke. Just didn't have time to lookup the fix
        // setChallengeOffer(msg);
      } else if (
        msg.msgType === 'gameChallengeRefused'
        || msg.msgType === 'gameChallengeCancelled'
      ) {
        setChallengeOffer(undefined);
      }
    });
  };

  return (
    <RoomProvider
      id={props.id}
      code={props.code}

      onMessageReceived={(envelope) => handleMessages(envelope.message)}
      onMessageSent={(envelope) => handleMessages(envelope.message)}
      renderFallback={() => <AwesomeLoaderPage />}
      render={({
        room, me, broadcastMessage, startStreaming, stopStreaming,
      }) => (
        <GameRoom
          me={me}
          room={room}
          // Streaming
          startStreaming={startStreaming}
          stopStreaming={stopStreaming}
          // Game
          currentGame={currentGame}
          challengeOffer={challengeOffer?.content}
          onChallengeOffer={(challenge) => {
            const payload: GameChallengeOfferRecord = {
              msgType: 'gameChallengeOffer',
              gameType: 'chess',
              content: challenge,
            };

            broadcastMessage(payload);
          }}
          onChallengeAccepted={({ challengeeId, challengerId }) => {
            // Ensure no one but the challengee can accept an offer
            if (me.id !== challengeeId) {
              return;
            }

            // Once the challenge is accepted the game can start
            const newGame = reduceChessGame.prepareGame({
              timeLimit: 'rapid', // Get it from outside
              homeColor: 'random', // Get it from outside
              playersBySide: {
                home: (challengerId === me.id) ? me.user : room.peers[challengerId].user,
                away: (challengeeId === me.id) ? me.user : room.peers[challengeeId].user,
              },
            });

            const payload: GameStartedRecord = {
              msgType: 'gameStarted',
              gameType: 'chess',
              content: newGame,
            };

            // Send the game to the peers
            broadcastMessage(payload);
          }}
          onChallengeRefused={(challenge) => {
            // Ensure no one but the challengee can refuse an offer
            if (me.id !== challenge.challengeeId) {
              return;
            }

            const payload: GameChallengeRefusedRecord = {
              msgType: 'gameChallengeRefused',
              gameType: 'chess',
              content: challenge,
            };

            // Send the game to the peers
            broadcastMessage(payload);
          }}
          onChallengeCancelled={(challenge) => {
            // Ensure no one but the challenger can cancel an offer
            if (me.id !== challenge.challengerId) {
              return;
            }

            const payload: GameChallengeCancelledRecord = {
              msgType: 'gameChallengeCancelled',
              gameType: 'chess',
              content: challenge,
            };

            // Send the game to the peers
            broadcastMessage(payload);
          }}
          onGameStateUpdate={(nextGameState) => {
            const payload: GameDataRecord = {
              msgType: 'gameUpdate',
              gameType: 'chess',
              content: nextGameState,
            };

            broadcastMessage(payload);
          }}
          // Chat
          chatHistory={chatHistory}
          broadcastMessage={broadcastMessage}
        />
      )}

    />
  );
};
