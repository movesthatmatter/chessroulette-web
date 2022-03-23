import { ChessPlayer, ChessPlayerBlack, ChessPlayerWhite } from 'chessroulette-io';
import { toDictIndexedBy } from 'src/lib/util';
import { Game } from 'src/modules/Games';
import {
  getRelativeMaterialScore,
  RelativeMaterialScore,
} from 'src/modules/Games/Chess/components/GameStateWidget/util';
import { Room, RoomMember } from 'src/modules/Room/types';
import { BaseRoomMatchActivity } from '../../redux/types';
import { RoomActivityParticipant } from '../../types';
import {
  toRoomActivityAbsentParticipant,
  toRoomActivityPresentParticipant,
} from '../../util/participantsUtil';
import { RoomMatchActivity, RoomMatchActivityParticipant } from './types';
import { RoomPlayActivity, toRoomPlayActivity } from '../PlayActivity';
import { toRoomMember } from 'src/modules/Room/util';

export const toRoomMatchActivity = (
  baseMatchActivity: BaseRoomMatchActivity,
  members: RoomMember[]
): RoomMatchActivity => {
  const { game } = baseMatchActivity;

  const { white, black } = membersToPlayingParticipants(game, members);
  const iamParticipating = black.participant.isMe || white.participant.isMe;

  if (iamParticipating) {
    const me = black.participant.isMe ? black : white;
    const opponent = me.player.color === 'white' ? black : white;

    return {
      ...baseMatchActivity,
      game,
      iamParticipating,
      participants: {
        me: {
          isRoomActivitySpecificParticipant: true,
          roomActivitySpecificParticipantType: 'match',
          participant: me.participant,
          userId: me.participant.userId,
          ...me.stats,
        },
        opponent: {
          isRoomActivitySpecificParticipant: true,
          roomActivitySpecificParticipantType: 'match',
          participant: opponent.participant,
          userId: opponent.participant.userId,
          ...opponent.stats,
        },
      },
    };
  } else {
    return {
      ...baseMatchActivity,
      game,
      iamParticipating,
      participants: {
        white: {
          isRoomActivitySpecificParticipant: true,
          roomActivitySpecificParticipantType: 'match',
          participant: white.participant,
          userId: white.participant.userId,
          ...white.stats,
        },
        black: {
          isRoomActivitySpecificParticipant: true,
          roomActivitySpecificParticipantType: 'match',
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
  const recordA = toParticipantRecord(playerA, membersMap, game, materialScore);
  const recordB = toParticipantRecord(playerB, membersMap, game, materialScore);

  const whiteRecord = recordA.player.color === 'white' ? recordA : recordB;
  const blackRecord = whiteRecord.player.user.id === recordB.player.user.id ? recordA : recordB;

  return {
    white: whiteRecord as WhitePlayerRecord,
    black: blackRecord as BlackPlayerRecord,
  };
};

const toParticipantRecord = <TPlayer extends ChessPlayerWhite | ChessPlayerBlack>(
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

export const roomMatchActivityParticipantToChessPlayer = (
  p: RoomMatchActivityParticipant
): ChessPlayer => ({
  color: p.color,
  user: p.participant.isPresent ? p.participant.member.peer.user : p.participant.user,
});

export const convertMatchActivityIntoPlayActivity = (
  activity: RoomMatchActivity,
  room: Room
): RoomPlayActivity => {
  const { match, type, ...baseActivity } = activity;
  const members = Object.values(room.peersIncludingMe);
  const membersList = members.map(toRoomMember);
  console.log('converting match to play activity', baseActivity);

  return {
    ...toRoomPlayActivity(
      {
        ...baseActivity,
        type: 'play',
      },
      membersList
    ),
  };
};
