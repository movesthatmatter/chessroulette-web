import { ChessPlayer, ChessPlayerBlack, ChessPlayerWhite } from 'dstnd-io';
import { toDictIndexedBy } from 'src/lib/util';
import { Game } from 'src/modules/Games';
import { getRelativeMaterialScore } from 'src/modules/Games/Chess/components/GameStateWidget/util';
import { BaseRoomPlayActivity } from '../redux/types';
import { RoomActivityParticipant } from '../types';
import { RoomPlayActivity, RoomPlayActivityParticipant } from './types';

type Stats = {
  isPlayer: true;
  canPlay: boolean;
  materialScore: number;
  color: ChessPlayer['color'];
};

const addPlayerStatsToPlayerZip = ({
  game,
  playerZip,
  materialScore,
}: {
  game: Game;
  playerZip: {
    participant: RoomActivityParticipant;
    player: ChessPlayer;
  };
  materialScore: number;
}): {
  participant: RoomActivityParticipant;
  player: ChessPlayer;
  stats: Stats;
} => {
  const { participant, player } = playerZip;

  const canPlay =
    participant.member.peer.isMe &&
    // game must be in playable mode
    (game.state === 'pending' || game.state === 'started') &&
    // It must be my turn or be white if first move
    (game.lastMoveBy ? game.lastMoveBy !== player.color : player.color === 'white');

  return {
    ...playerZip,
    stats: {
      isPlayer: true,
      canPlay,
      materialScore,
      color: player.color,
    },
  };
};

const getMatchedPlayersStats = ({
  game,
  participantPlayerZipA,
  participantPlayerZipB,
}: {
  game: Game;
  participantPlayerZipA: {
    participant: RoomActivityParticipant;
    player: ChessPlayer;
  };
  participantPlayerZipB: {
    participant: RoomActivityParticipant;
    player: ChessPlayer;
  };
}): {
  black: {
    participant: RoomActivityParticipant;
    player: ChessPlayerBlack;
    stats: Stats;
  };
  white: {
    participant: RoomActivityParticipant;
    player: ChessPlayerWhite;
    stats: Stats;
  };
} => {
  const relativeMaterialScore = getRelativeMaterialScore(game);

  const playerAZip = addPlayerStatsToPlayerZip({
    game,
    playerZip: participantPlayerZipA,
    materialScore: relativeMaterialScore[participantPlayerZipA.player.color],
  });

  const playerBZip = addPlayerStatsToPlayerZip({
    game,
    playerZip: participantPlayerZipB,
    materialScore: relativeMaterialScore[participantPlayerZipB.player.color],
  });

  const whitePlayer = playerAZip.player.color === 'white' ? playerAZip : playerBZip;
  const blackPlayer =
    whitePlayer.player.user.id === playerAZip.player.user.id ? playerBZip : playerAZip;

  return {
    white: {
      ...whitePlayer,
      player: whitePlayer.player as ChessPlayerWhite,
    },
    black: {
      ...blackPlayer,
      player: blackPlayer.player as ChessPlayerBlack,
    },
  };
};

/**
 * This ensures the Ids are Matching or returns undefined!
 */
const getMatchedParticipantToPlayer = (
  players: Game['players'],
  participants: RoomActivityParticipant[]
) => {
  const participantsIndexedByUserId = toDictIndexedBy(participants, (p) => p.userId);

  const [playerA, playerB] = players;

  const {
    [playerA.user.id]: playerAParticipant,
    [playerB.user.id]: playerBParticipant,
  } = participantsIndexedByUserId;

  if (!(playerAParticipant && playerBParticipant)) {
    return undefined;
  }

  return [
    {
      player: playerA,
      participant: playerAParticipant,
    },
    {
      player: playerB,
      participant: playerBParticipant,
    },
  ];
};

export const toRoomPlayActivity = (
  basePlayActivity: BaseRoomPlayActivity,
  participants: RoomActivityParticipant[]
): RoomPlayActivity => {
  const { game } = basePlayActivity;

  if (!game) {
    return {
      ...basePlayActivity,
      game: undefined,
      participants: undefined,
    };
  }

  const matchedParticipantToPlayer = getMatchedParticipantToPlayer(game.players, participants);

  if (!matchedParticipantToPlayer) {
    return {
      ...basePlayActivity,
      game: undefined,
      participants: undefined,
    };
  }

  const [participantPlayerZipA, participantPlayerZipB] = matchedParticipantToPlayer;

  const { black, white } = getMatchedPlayersStats({
    game,
    participantPlayerZipA,
    participantPlayerZipB,
  });

  const iamParticipating = black.participant.member.peer.isMe || white.participant.member.peer.isMe;

  if (iamParticipating) {
    const me = black.participant.member.peer.isMe ? black : white;
    const opponent = me.player.color === 'white' ? black : white;

    return {
      ...basePlayActivity,
      game,
      iamParticipating,
      participants: {
        me: {
          isRoomActivitySpecificParticipant: true,
          roomActivitySpecificParticipantType: 'play',
          participant: me.participant,
          userId: me.participant.userId,
          ...me.stats,
        },
        opponent: {
          isRoomActivitySpecificParticipant: true,
          roomActivitySpecificParticipantType: 'play',
          participant: opponent.participant,
          userId: opponent.participant.userId,
          ...opponent.stats,
        },
      },
    };
  } else {
    return {
      ...basePlayActivity,
      game,
      iamParticipating,
      participants: {
        white: {
          isRoomActivitySpecificParticipant: true,
          roomActivitySpecificParticipantType: 'play',
          participant: white.participant,
          userId: white.participant.userId,
          ...white.stats,
        },
        black: {
          isRoomActivitySpecificParticipant: true,
          roomActivitySpecificParticipantType: 'play',
          participant: black.participant,
          userId: black.participant.userId,
          ...black.stats,
        },
      },
    };
  }
};

export const roomPlayActivityParticipantToChessPlayer = (
  p: RoomPlayActivityParticipant
): ChessPlayer => ({
  color: p.color,
  user: p.participant.member.peer.user,
});
