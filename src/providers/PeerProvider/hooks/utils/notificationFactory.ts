import { toISODateTime } from 'io-ts-isodatetime';
import { getPlayerByColor } from 'src/modules/GameRoomV2/util';
import { Game } from 'src/modules/Games';
import {
  Notification,
  OfferNotification,
  RoomWithPlayActivity,
} from '../../types';

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

export const notificationFactory = (
  game: Game,
  offer?: RoomWithPlayActivity['activity']['offer'],
  prevOffer?: RoomWithPlayActivity['activity']['offer'],
): NotificationFactoryReturn | undefined => {
  const now = new Date();

  if (!offer && prevOffer) {
    if (prevOffer.type === 'rematch') {
      return {
        type: 'update',
        id: prevOffer.id,
        status: prevOffer.content.gameId !== game.id ? 'accepted' : 'withdrawn',
      };
    } else if (prevOffer.type === 'draw') {
      if (game.state === 'stopped' && game.winner === '1/2') {
        return {
          type: 'update',
          id: prevOffer.id,
          status: 'accepted',
        };
      } else {
        return {
          type: 'update',
          id: prevOffer.id,
          status: 'withdrawn',
        };
      }
    }
  } else if (offer) {
    switch (offer.type) {
      case 'draw':
        return {
          type: 'add',
          notification: {
            id: offer.id,
            timestamp: toISODateTime(now),
            type: 'offer',
            status: 'pending',
            offerType: 'draw',
            byUser: offer.content.byUser,
            toUser: offer.content.toUser,
          },
        };
        break;
      case 'rematch':
        return {
          type: 'add',
          notification: {
            id: offer.id,
            timestamp: toISODateTime(now),
            type: 'offer',
            offerType: 'rematch',
            byUser: offer.content.byUser,
            toUser: offer.content.toUser,
            status: 'pending',
          },
        };
        break;
    }
  }

  if (game.state === 'finished') {
    if (game.winner === 'black' || game.winner === 'white') {
      return {
        type: 'add',
        notification: {
          type: 'info',
          infoType: 'win',
          id: `${game.id}-${game.winner}-win`,
          timestamp: toISODateTime(now),
          content: `${getPlayerByColor(game.winner, game.players)?.user.name} has won`,
        },
      };
    }
    if (game.winner === '1/2') {
      return {
        type: 'add',
        notification: {
          type: 'info',
          infoType: 'draw',
          id: `${game.id}-draw`,
          timestamp: toISODateTime(now),
          content: 'Game Ended in a Draw by Stalemate!',
        },
      };
    }
  }
  if (game.state === 'stopped') {
    if (game.winner === '1/2') {
      return {
        type: 'add',
        notification: {
          type: 'info',
          infoType: 'draw',
          id: `${game.id}-draw`,
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
          id: `${game.id}-${game.winner}-resign`,
          timestamp: toISODateTime(now),
          content: `${getPlayerByColor(game.lastMoveBy, game.players)?.user.name} has resigned`,
        },
      };
    }
  }

  return undefined;
};
