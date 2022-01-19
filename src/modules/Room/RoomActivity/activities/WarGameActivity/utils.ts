import { WarGamePlayer, WarGamePlayerBlack, warGamePlayerBlack, WarGamePlayerWhite } from 'dstnd-io';
import { toDictIndexedBy } from 'src/lib/util';
import { WarGame } from 'src/modules/Games';
import {
  getRelativeMaterialScore,
  RelativeMaterialScore,
} from 'src/modules/Games/Chess/components/GameStateWidget/util';
import { RoomMember } from 'src/modules/Room/types';
import { BaseRoomWarGameActivity } from '../../redux/types';
import { RoomActivityParticipant } from '../../types';
import {
  toRoomActivityAbsentParticipant,
  toRoomActivityPresentParticipant,
} from '../../util/participantsUtil';
import { RoomWarGameActivity, RoomWarGameActivityParticipant } from './types';

export const toRoomWarGameActivity = (
  baseWarGameActivity: BaseRoomWarGameActivity,
  members: RoomMember[]
): RoomWarGameActivity => {
  const { game } = baseWarGameActivity;

  if (!game) {
    return {
      ...baseWarGameActivity,
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
      ...baseWarGameActivity,
      game,
      iamParticipating,
      participants: {
        me: {
          isRoomActivitySpecificParticipant: true,
          roomActivitySpecificParticipantType: 'warGame',
          participant: me.participant,
          userId: me.participant.userId,
          ...me.stats,
        },
        opponent: {
          isRoomActivitySpecificParticipant: true,
          roomActivitySpecificParticipantType: 'warGame',
          participant: opponent.participant,
          userId: opponent.participant.userId,
          ...opponent.stats,
        },
      },
    };
  } else {
    return {
      ...baseWarGameActivity,
      game,
      iamParticipating,
      participants: {
        white: {
          isRoomActivitySpecificParticipant: true,
          roomActivitySpecificParticipantType: 'warGame',
          participant: white.participant,
          userId: white.participant.userId,
          ...white.stats,
        },
        black: {
          isRoomActivitySpecificParticipant: true,
          roomActivitySpecificParticipantType: 'warGame',
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
  player: WarGamePlayerWhite;
  stats: Stats;
};

type BlackPlayerRecord = {
  participant: RoomActivityParticipant;
  player: WarGamePlayerBlack;
  stats: Stats;
};

const membersToPlayingParticipants = (game: WarGame, members: RoomMember[]) => {
  const membersMap = toDictIndexedBy(members, (m) => m.userId);

  return getParticipants(game, membersMap);
};

const getParticipants = (game: WarGame, membersMap: RoomMembersMap) => {
  const [playerA, playerB] = game.players;
  const recordA = toParticipantRecord(playerA, membersMap, game);
  const recordB = toParticipantRecord(playerB, membersMap, game);

  const whiteRecord = recordA.player.color === 'white' ? recordA : recordB;
  const blackRecord = whiteRecord.player.user.id === recordB.player.user.id ? recordA : recordB;

  return {
    white: whiteRecord as WhitePlayerRecord,
    black: blackRecord as BlackPlayerRecord,
  };
};

const toParticipantRecord = <TPlayer extends WarGamePlayerWhite | WarGamePlayerBlack>(
  player: TPlayer,
  membersMap: RoomMembersMap,
  game: WarGame,
) => {
  const participant = membersMap[player.user.id]
    ? toRoomActivityPresentParticipant(membersMap[player.user.id])
    : toRoomActivityAbsentParticipant(player.user);

  return {
    player,
    participant,
    stats: getPlayerStats(game, player, participant),
  } as const;
};

type Stats = {
  isPlayer: true;
  canPlay: boolean;
  materialScore: number;
  color: WarGamePlayer['color'];
};

const getPlayerStats = (
  game: WarGame,
  player: WarGamePlayer,
  participant: RoomActivityParticipant,
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
    color: player.color,
  };
};

export const roomWarGameActivityParticipantToWarGamePlayer = (
  p: RoomWarGameActivityParticipant
): WarGamePlayer => ({
  color: p.color,
  user: p.participant.isPresent ? p.participant.member.peer.user : p.participant.user,
});
