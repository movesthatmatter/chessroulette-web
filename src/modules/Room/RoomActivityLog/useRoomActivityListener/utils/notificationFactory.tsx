import {
  metadata,
  RoomChallengeRecord,
  RoomWithPlayActivityRecord,
} from 'dstnd-io';
import { toISODateTime } from 'io-ts-isodatetime';
import { Game } from 'src/modules/Games';
import HumanizeDuration from 'humanize-duration';
import { getUserDisplayName } from 'src/modules/User';
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import { Notification, OfferNotification } from '../../types';
import { getPlayerByColor } from 'src/modules/Games/Chess/lib';

type NotificationState = {
  game?: Game;
  offer?: RoomWithPlayActivityRecord['activity']['offer'];
  pendingRoomChallenge?: RoomChallengeRecord;
};

type NotificationFactoryReturn =
  | {
      type: 'update';
      id: string;
      status: OfferNotification['status'];
    }
  | {
      type: 'add';
      notification: Notification;
    };

const formatTimeLimit = HumanizeDuration.humanizer({
  largest: 2,
  round: true,
});

export const notificationFactory = ({
  prev,
  current,
}: {
  prev: NotificationState;
  current: NotificationState;
}): NotificationFactoryReturn | undefined => {
  const now = new Date();

  if (current.pendingRoomChallenge) {
    return {
      type: 'add',
      notification: {
        timestamp: toISODateTime(now),
        challengeType: 'open',
        id: current.pendingRoomChallenge.id,
        type: 'challenge',
        status: 'pending',
        byUser: current.pendingRoomChallenge.createdByUser,
        gameSpecs: current.pendingRoomChallenge.gameSpecs,
        challenge: current.pendingRoomChallenge,
      },
    };
  }

  if (!current.pendingRoomChallenge && prev.pendingRoomChallenge) {
    return {
      type: 'update',
      id: prev.pendingRoomChallenge.id,
      status: !!current.game ? 'accepted' : 'withdrawn',
    };
  }

  // Later on this could be another notification
  if (!current.game) {
    return undefined;
  }
  //  const [notifications, setnotifications] = useState<Notification[]>()

  if (!current.offer && prev.offer) {
    if (prev.offer.type === 'rematch') {
      return {
        type: 'update',
        id: prev.offer.id,
        status: prev.offer.content.gameId !== current.game.id ? 'accepted' : 'withdrawn',
      };
    } else if (prev.offer.type === 'draw') {
      if (current.game.state === 'stopped' && current.game.winner === '1/2') {
        return {
          type: 'update',
          id: prev.offer.id,
          status: 'accepted',
        };
      }

      return {
        type: 'update',
        id: prev.offer.id,
        status: 'withdrawn',
      };
    } else if (prev.offer.type === 'challenge') {
      if (current.game.id !== prev.game?.id) {
        return {
          type: 'update',
          id: prev.offer.id,
          status: 'accepted',
        };
      }

      return {
        type: 'update',
        id: prev.offer.id,
        status: 'withdrawn',
      };
    } else if (prev.offer.type === 'takeback') {
      if (
        current.game.history &&
        prev.game &&
        prev.game.history &&
        current.game.history?.length < prev.game?.history?.length
      ) {
        return {
          type: 'update',
          id: prev.offer.id,
          status: 'accepted',
        };
      }
      return {
        type: 'update',
        id: prev.offer.id,
        status: 'withdrawn',
      };
    }
  } else if (current.offer) {
    switch (current.offer.type) {
      case 'draw':
        return {
          type: 'add',
          notification: {
            id: current.offer.id,
            timestamp: toISODateTime(now),
            type: 'offer',
            status: 'pending',
            offerType: 'draw',
            byUser: current.offer.content.byUser,
            toUser: current.offer.content.toUser,
          },
        };
      case 'takeback':
        return {
          type: 'add',
          notification: {
            id: current.offer.id,
            timestamp: toISODateTime(now),
            type: 'offer',
            status: 'pending',
            offerType: 'takeback',
            byUser: current.offer.content.byUser,
            toUser: current.offer.content.toUser,
          },
        };
      case 'rematch':
        return {
          type: 'add',
          notification: {
            timestamp: toISODateTime(now),
            id: current.offer.id,
            type: 'offer',
            offerType: 'rematch',
            byUser: current.offer.content.byUser,
            toUser: current.offer.content.toUser,
            status: 'pending',
          },
        };
      case 'challenge':
        return {
          type: 'add',
          notification: {
            timestamp: toISODateTime(now),
            id: current.offer.id,
            type: 'offer',
            offerType: 'challenge',
            byUser: current.offer.content.byUser,
            toUser: current.offer.content.toUser,
            status: 'pending',
          },
        };
    }
  }

  // // A pending Game
  // if (current.game.state === 'pending' && (prev.game?.state !== 'pending')) {
  //   return {
  //     type: 'add',
  //     notification: {
  //       type: 'info',
  //       infoType: 'draw',
  //       id: `${current.game.id}-pending`, // TODO: Refactor
  //       timestamp: toISODateTime(now),
  //       content: `Waiting for ${getPlayerByColor('white', current.game.players)?.user.name} to move`,
  //     },
  //   };
  // }

  // A new game has started
  // TODO: Not Tested!
  if (current.game.state === 'started' && (!prev.game || prev.game.state === 'pending')) {
    return {
      type: 'add',
      notification: {
        type: 'info',
        infoType: 'draw',
        id: `${current.game.id}-new`, // TODO: Refactor
        timestamp: toISODateTime(now),
        content: {
          __html: `<div>A new ${formatTimeLimit(
            metadata.game.chessGameTimeLimitMsMap[current.game.timeLimit]
          )} game has started between <strong>${getUserDisplayName(
            current.game.players[0].user
          )}</strong> & <strong>${getUserDisplayName(current.game.players[1].user)}</strong></div>`,
        },
      },
    };
  }

  if (current.game.state === 'finished') {
    if (current.game.winner === 'black' || current.game.winner === 'white') {
      return {
        type: 'add',
        notification: {
          type: 'info',
          infoType: 'win',
          id: `${current.game.id}-${current.game.winner}-win`,
          timestamp: toISODateTime(now),
          content: {
            __html: `<div><strong>${getUserDisplayName(
              getPlayerByColor(current.game.winner, current.game.players).user
            )}</strong> won!</div>`,
          },
        },
      };
    }
    if (current.game.winner === '1/2') {
      return {
        type: 'add',
        notification: {
          type: 'info',
          infoType: 'draw',
          id: `${current.game.id}-draw`,
          timestamp: toISODateTime(now),
          content: `Game has ended in a draw by stalemate!`,
        },
      };
    }
  }

  if (current.game.state === 'stopped') {
    if (current.game.winner === '1/2') {
      return {
        type: 'add',
        notification: {
          type: 'info',
          infoType: 'draw',
          id: `${current.game.id}-draw`,
          timestamp: toISODateTime(now),
          content: `Game has ended in a draw`,
        },
      };
    } else {
      return {
        type: 'add',
        notification: {
          type: 'info',
          infoType: 'resign',
          id: `${current.game.id}-${current.game.winner}-resign`,
          timestamp: toISODateTime(now),
          content: {
            __html: `<div><strong>${getUserDisplayName(
              getPlayerByColor(otherChessColor(current.game.winner), current.game.players).user
            )}</strong> has resigned. <strong>${getUserDisplayName(
              getPlayerByColor(current.game.winner, current.game.players).user
            )}</strong> won!</div>`,
          },
        },
      };
    }
  }

  return undefined;
};
