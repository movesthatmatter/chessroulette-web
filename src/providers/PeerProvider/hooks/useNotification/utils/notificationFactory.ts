import { toISODateTime } from 'io-ts-isodatetime';
import { getPlayerByColor } from 'src/modules/GameRoomV2/util';
import { Game } from 'src/modules/Games';
import { Notification, OfferNotification, RoomWithPlayActivity } from '../../../types';

type NotificationDependencies = {
  game?: Game;
  offer?: RoomWithPlayActivity['activity']['offer'];
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

export const notificationFactory = ({
  prev,
  current,
}: {
  prev: NotificationDependencies;
  current: NotificationDependencies;
}): NotificationFactoryReturn | undefined => {

  // Later on this could be another notification
  if (!current.game) {
    return undefined;
  }
  
  const now = new Date();

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
      } else {
        return {
          type: 'update',
          id: prev.offer.id,
          status: 'withdrawn',
        };
      }
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
        break;
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
        break;
    }
  }

  // if (current.game.state === 'started')
  if (current.game.state === 'finished') {
    if (current.game.winner === 'black' || current.game.winner === 'white') {
      return {
        type: 'add',
        notification: {
          type: 'info',
          infoType: 'win',
          id: `${current.game.id}-${current.game.winner}-win`,
          timestamp: toISODateTime(now),
          content: `${
            getPlayerByColor(current.game.winner, current.game.players)?.user.name
          } has won`,
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
          content: 'Game Ended in a Draw by Stalemate!',
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
          content: 'Game has ended in a draw',
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
          content: `${
            getPlayerByColor(current.game.lastMoveBy, current.game.players)?.user.name
          } has resigned`,
        },
      };
    }
  }

  return undefined;
};
