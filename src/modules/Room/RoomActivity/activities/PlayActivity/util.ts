import { ChessPlayer, ChessPlayerBlack, ChessPlayerWhite } from 'dstnd-io';
import { toDictIndexedBy } from 'src/lib/util';
import { Game } from 'src/modules/Games';
import {
  getRelativeMaterialScore,
  RelativeMaterialScore,
} from 'src/modules/Games/Chess/components/GameStateWidget/util';
import { RoomMember } from 'src/modules/Room/types';
import { BaseRoomPlayActivity } from '../../redux/types';
import { RoomActivityParticipant } from '../../types';
import {
  toRoomActivityAbsentParticipant,
  toRoomActivityPresentParticipant,
} from '../../util/participantsUtil';
import { RoomPlayActivity, RoomPlayActivityParticipant } from './types';

export const toRoomPlayActivity = (
  basePlayActivity: BaseRoomPlayActivity,
  members: RoomMember[]
): RoomPlayActivity => {
  const { game } = basePlayActivity;

  if (!game) {
    return {
      ...basePlayActivity,
      game: undefined,
      participants: undefined,
    };
  }

  const { white, black } = membersToPlayingParticipants(game, members);
  const iamParticipating = black.participant.isMe || white.participant.isMe;

  if (iamParticipating) {
    const me = black.participant.isMe ? black : white;
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

type RoomMembersMap = Record<RoomMember['userId'], RoomMember>;

type WhitePlayerRecord = {
  participant: RoomActivityParticipant;
  player: ChessPlayerWhite;
  stats: Stats;
};

type BlackPlayerRecord = {
  participant: RoomActivityParticipant;
  player: ChessPlayerBlack;
  stats: Stats;
};

const membersToPlayingParticipants = (game: Game, members: RoomMember[]) => {
  const membersMap = toDictIndexedBy(members, (m) => m.userId);

  return getParticipants(game, membersMap);
};

const getParticipants = (game: Game, membersMap: RoomMembersMap) => {
  const [playerA, playerB] = game.players;
  const materialScore = getRelativeMaterialScore(game);
  const recordA = toRecord(playerA, membersMap, game, materialScore);
  const recordB = toRecord(playerB, membersMap, game, materialScore);

  const whiteRecord = recordA.player.color === 'white' ? recordA : recordB;
  const blackRecord = whiteRecord.player.user.id === recordB.player.user.id ? recordA : recordB;

  return {
    white: whiteRecord as WhitePlayerRecord,
    black: blackRecord as BlackPlayerRecord,
  };
};

const toRecord = <TPlayer extends ChessPlayerWhite | ChessPlayerBlack>(
  player: TPlayer,
  membersMap: RoomMembersMap,
  game: Game,
  relativeMaterialScore: RelativeMaterialScore
) => {
  const participant = membersMap[player.user.id]
    ? toRoomActivityPresentParticipant(membersMap[player.user.id])
    : toRoomActivityAbsentParticipant(player.user);

  return {
    player,
    participant,
    stats: getPlayerStats(game, player, participant, relativeMaterialScore),
  } as const;
};

type Stats = {
  isPlayer: true;
  canPlay: boolean;
  materialScore: number;
  color: ChessPlayer['color'];
};

const getPlayerStats = (
  game: Game,
  player: ChessPlayer,
  participant: RoomActivityParticipant,
  gameMaterialScore: RelativeMaterialScore
) => {
  const canPlay =
    participant.isMe &&
    // game must be in playable mode
    (game.state === 'pending' || game.state === 'started') &&
    // It must be my turn or be white if first move
    (game.lastMoveBy ? game.lastMoveBy !== player.color : player.color === 'white');

  return {
    isPlayer: true,
    canPlay,
    materialScore: gameMaterialScore[player.color],
    color: player.color,
  };
};

export const roomPlayActivityParticipantToChessPlayer = (
  p: RoomPlayActivityParticipant
): ChessPlayer => ({
  color: p.color,
  user: p.participant.isPresent ? p.participant.member.peer.user : p.participant.user,
});
