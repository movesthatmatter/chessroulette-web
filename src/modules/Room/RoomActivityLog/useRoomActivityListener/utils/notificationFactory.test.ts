import { RoomPlayActivityRecord } from 'chessroulette-io';
import { GameMocker } from 'src/mocks/records';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { playNotificationFactory as notificationFactory } from './notificationFactory';

const gameMocker = new GameMocker();
const roomMocker = new RoomMocker();

describe('Info Notifications', () => {
  test('should return a RESIGN', () => {
    const game = gameMocker.stopped();
    const notification = notificationFactory({
      current: {
        game,
      },
      prev: {},
    });

    expect(notification).not.toBe(undefined);
    if (notification === undefined) {
      return;
    }

    expect(notification.type).toBe('add');
    if (notification.type !== 'add') {
      return;
    }

    expect(notification.notification.type).toBe('info');
    if (notification.notification.type !== 'info') {
      return;
    }

    expect(notification.notification.infoType).toBe('resign');
  });

  test('should return a DRAW', () => {
    const game = gameMocker.withProps({
      state: 'stopped',
      winner: '1/2',
    });
    const notification = notificationFactory({
      current: {
        game,
      },
      prev: {},
    });

    expect(notification).not.toBe(undefined);
    if (notification === undefined) {
      return;
    }

    expect(notification.type).toBe('add');
    if (notification.type !== 'add') {
      return;
    }

    expect(notification.notification.type).toBe('info');
    if (notification.notification.type !== 'info') {
      return;
    }

    expect(notification.notification.infoType).toBe('draw');
  });

  test('should return a WIN', () => {
    const game = gameMocker.withProps({
      state: 'finished',
      winner: 'black',
    });

    const notification = notificationFactory({
      current: {
        game,
      },
      prev: {},
    });

    expect(notification).not.toBe(undefined);
    if (notification === undefined) {
      return;
    }

    expect(notification.type).toBe('add');
    if (notification.type !== 'add') {
      return;
    }

    expect(notification.notification.type).toBe('info');
    if (notification.notification.type !== 'info') {
      return;
    }

    expect(notification.notification.infoType).toBe('win');
  });

  test('should return a DRAW by STALEMATE', () => {
    const game = gameMocker.withProps({
      state: 'finished',
      winner: '1/2',
    });

    const notification = notificationFactory({
      current: {
        game,
      },
      prev: {},
    });

    expect(notification).not.toBe(undefined);
    if (notification === undefined) {
      return;
    }

    expect(notification.type).toBe('add');
    if (notification.type !== 'add') {
      return;
    }

    expect(notification.notification.type).toBe('info');
    if (notification.notification.type !== 'info') {
      return;
    }

    expect(notification.notification.infoType).toBe('draw');
  });
});

describe('REMATCH OFFERS notifications', () => {
  test('should return a REMATCH OFFER', () => {
    const game = gameMocker.started();
    const room = roomMocker.withProps({
      activity: {
        type: 'play',
        gameId: game.id,
        offer: {
          id: '23123',
          type: 'rematch',
          content: {
            gameId: game.id,
            by: 'white',
            byUser: game.players.filter((player) => player.color === 'white')[0].user,
            toUser: game.players.filter((player) => player.color === 'black')[0].user,
            gameSpecs: {
              timeLimit: 'blitz5',
              preferredColor: 'white',
            },
          },
        },
      },
    });

    const offer: RoomPlayActivityRecord['offer'] =
      room.activity.type === 'play' ? room.activity.offer : undefined;
    const notification = notificationFactory({
      current: {
        game,
        offer,
      },
      prev: {},
    });

    expect(notification).not.toBe(undefined);
    if (notification === undefined) {
      return;
    }

    expect(notification.type).toBe('add');
    if (notification.type !== 'add') {
      return;
    }

    expect(notification.notification.type).toBe('offer');
    if (notification.notification.type !== 'offer') {
      return;
    }

    expect(notification.notification.offerType).toBe('rematch');
    expect(notification.notification.status).toBe('pending');
    expect(notification.notification.byUser).toEqual(
      game.players.filter((player) => player.color === 'white')[0].user
    );
  });

  test('should return a REMATCH OFFER ACCEPTED', () => {
    const game = gameMocker.started();
    const room = roomMocker.withProps({
      activity: {
        type: 'play',
        gameId: game.id,
        offer: {
          id: '23123',
          type: 'rematch',
          content: {
            gameId: game.id,
            by: 'white',
            byUser: game.players.filter((player) => player.color === 'white')[0].user,
            toUser: game.players.filter((player) => player.color === 'black')[0].user,
            gameSpecs: {
              timeLimit: 'blitz5',
              preferredColor: 'white',
            },
          },
        },
      },
    });
    const offer: RoomPlayActivityRecord['offer'] =
      room.activity.type === 'play' ? room.activity.offer : undefined;
    const notification = notificationFactory({
      current: {
        game,
        offer,
      },
      prev: {},
    });

    expect(notification).not.toBe(undefined);
    if (notification === undefined) {
      return;
    }

    expect(notification.type).toBe('add');
    if (notification.type !== 'add') {
      return;
    }

    expect(notification.notification.type).toBe('offer');
    if (notification.notification.type !== 'offer') {
      return;
    }

    expect(notification.notification.offerType).toBe('rematch');
    expect(notification.notification.status).toBe('pending');
    expect(notification.notification.byUser).toEqual(
      game.players.filter((player) => player.color === 'white')[0].user
    );

    const updateNotification = notificationFactory({
      current: {
        game: gameMocker.record(),
        offer: undefined,
      },
      prev: {
        offer,
      },
    });
    expect(updateNotification).not.toBe(undefined);
    if (updateNotification === undefined) {
      return;
    }
    expect(updateNotification.type).toBe('update');
    if (updateNotification.type !== 'update') {
      return;
    }
    expect(updateNotification.status).toBe('accepted');
    expect(updateNotification.id).toBe(offer?.id);
  });

  test('should return a REMATCH OFFER WITHDRAWN', () => {
    const game = gameMocker.started();
    const room = roomMocker.withProps({
      activity: {
        type: 'play',
        gameId: game.id,
        offer: {
          id: '23123',
          type: 'rematch',
          content: {
            gameId: game.id,
            by: 'white',
            byUser: game.players.filter((player) => player.color === 'white')[0].user,
            toUser: game.players.filter((player) => player.color === 'black')[0].user,
            gameSpecs: {
              timeLimit: 'blitz5',
              preferredColor: 'white',
            },
          },
        },
      },
    });

    const offer = room.activity.type === 'play' ? room.activity.offer : undefined;

    // This is redundant but just for the sake of checking the types
    expect(offer?.type).toBe('rematch');
    if (offer?.type !== 'rematch') {
      return;
    }

    const notification = notificationFactory({
      current: {
        game,
        offer,
      },
      prev: {},
    });

    expect(notification).not.toBe(undefined);
    if (notification === undefined) {
      return;
    }

    expect(notification.type).toBe('add');
    if (notification.type !== 'add') {
      return;
    }

    expect(notification.notification.type).toBe('offer');
    if (notification.notification.type !== 'offer') {
      return;
    }

    expect(notification.notification.status).toBe('pending');
    expect(notification.notification.byUser).toEqual(
      game.players.filter((player) => player.color === 'white')[0].user
    );

    const updateNotification = notificationFactory({
      current: {
        game,
        offer: undefined,
      },
      prev: {
        offer,
      },
    });

    expect(updateNotification).not.toBe(undefined);
    if (updateNotification === undefined) {
      return;
    }

    expect(updateNotification.type).toBe('update');
    if (updateNotification.type !== 'update') {
      return;
    }

    expect(updateNotification.status).toBe('withdrawn');
    expect(updateNotification.id).toBe(offer?.id);
    expect(offer?.content.gameId).toBe(game.id);
  });
});

describe('DRAW OFERS notifications ', () => {
  test('should return a DRAW OFFER', () => {
    const game = gameMocker.started();
    const room = roomMocker.withProps({
      activity: {
        type: 'play',
        gameId: game.id,
        offer: {
          id: '23123',
          type: 'draw',
          content: {
            gameId: game.id,
            by: 'white',
            byUser: game.players.filter((player) => player.color === 'white')[0].user,
            toUser: game.players.filter((player) => player.color === 'black')[0].user,
          },
        },
      },
    });
    const offer: RoomPlayActivityRecord['offer'] =
      room.activity.type === 'play' ? room.activity.offer : undefined;
    const notification = notificationFactory({
      current: {
        game,
        offer,
      },
      prev: {},
    });
    expect(notification).not.toBe(undefined);
    if (notification === undefined) {
      return;
    }
    expect(notification.type).toBe('add');
    if (notification.type !== 'add') {
      return;
    }
    expect(notification.notification.type).toBe('offer');
    if (notification.notification.type !== 'offer') {
      return;
    }
    expect(notification.notification.offerType).toBe('draw');
    expect(notification.notification.status).toBe('pending');
    expect(notification.notification.byUser).toEqual(
      game.players.filter((player) => player.color === 'white')[0].user
    );
  });

  test('should return a DRAW OFFER ACCEPTED', () => {
    const game = gameMocker.started();
    const room = roomMocker.withProps({
      activity: {
        type: 'play',
        gameId: game.id,
        offer: {
          id: '23123',
          type: 'draw',
          content: {
            gameId: game.id,
            by: 'white',
            byUser: game.players.filter((player) => player.color === 'white')[0].user,
            toUser: game.players.filter((player) => player.color === 'black')[0].user,
          },
        },
      },
    });
    const offer: RoomPlayActivityRecord['offer'] =
      room.activity.type === 'play' ? room.activity.offer : undefined;
    const notification = notificationFactory({
      current: {
        game,
        offer,
      },
      prev: {},
    });

    expect(notification).not.toBe(undefined);
    if (notification === undefined) {
      return;
    }

    expect(notification.type).toBe('add');
    if (notification.type !== 'add') {
      return;
    }

    expect(notification.notification.type).toBe('offer');
    if (notification.notification.type !== 'offer') {
      return;
    }

    expect(notification.notification.offerType).toBe('draw');
    expect(notification.notification.status).toBe('pending');
    expect(notification.notification.byUser).toEqual(
      game.players.filter((player) => player.color === 'white')[0].user
    );

    const updateNotification = notificationFactory({
      current: {
        game: gameMocker.withProps({
          state: 'stopped',
          winner: '1/2',
        }),
        offer: undefined,
      },
      prev: {
        offer,
      },
    });

    expect(updateNotification).not.toBe(undefined);
    if (updateNotification === undefined) {
      return;
    }

    expect(updateNotification.type).toBe('update');
    if (updateNotification.type !== 'update') {
      return;
    }

    expect(updateNotification.status).toBe('accepted');
    expect(updateNotification.id).toBe(offer?.id);
  });

  test('should return a DRAW OFFER WITHDRAWN', () => {
    const game = gameMocker.started();
    const room = roomMocker.withProps({
      activity: {
        type: 'play',
        gameId: game.id,
        offer: {
          id: '23123',
          type: 'draw',
          content: {
            gameId: game.id,
            by: 'white',
            byUser: game.players.filter((player) => player.color === 'white')[0].user,
            toUser: game.players.filter((player) => player.color === 'black')[0].user,
          },
        },
      },
    });
    const offer: RoomPlayActivityRecord['offer'] =
      room.activity.type === 'play' ? room.activity.offer : undefined;
    const notification = notificationFactory({
      current: { game, offer },
      prev: {},
    });

    expect(notification).not.toBe(undefined);
    if (notification === undefined) {
      return;
    }

    expect(notification.type).toBe('add');
    if (notification.type !== 'add') {
      return;
    }

    expect(notification.notification.type).toBe('offer');
    if (notification.notification.type !== 'offer') {
      return;
    }

    expect(notification.notification.offerType).toBe('draw');
    expect(notification.notification.status).toBe('pending');
    expect(notification.notification.byUser).toEqual(
      game.players.filter((player) => player.color === 'white')[0].user
    );

    const updateNotification = notificationFactory({
      current: { game },
      prev: { offer },
    });

    expect(updateNotification).not.toBe(undefined);
    if (updateNotification === undefined) {
      return;
    }

    expect(updateNotification.type).toBe('update');
    if (updateNotification.type !== 'update') {
      return;
    }

    expect(updateNotification.status).toBe('withdrawn');
    expect(updateNotification.id).toBe(offer?.id);
  });
});
