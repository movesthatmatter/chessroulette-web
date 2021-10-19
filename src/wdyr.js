if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');

  const React = require('react');
  const { ChessGame } = require('./modules/Games/Chess');
  const {
    StyledChessBoard,
  } = require('./modules/Games/Chess/components/ChessBoard/StyledChessBoard');
  const { ChessBoard } = require('./modules/Games/Chess/components/ChessBoard');
  const { NoActivity } = require('./modules/Room/RoomActivity/activities/NoActivity');
  const { Room } = require('./modules/Room/Room');
  const { JoinRoomBouncer } = require('./modules/Room/JoinRoomBouncer');
  const { RoomRoute } = require('./modules/Room/RoomRoute');
  const {
    GenericLayoutDesktopRoomConsumer,
  } = require('./modules/Room/RoomConsumers/GenericLayoutDesktopRoomConsumer');
  const { ActivityRoomConsumer } = require('./modules/Room/RoomConsumers/ActivityRoomConsumer');
  const {
    PlayActivity,
  } = require('./modules/Room/RoomActivity/activities/PlayActivity/PlayActivity');
  const {
    PlayActivityContainer,
  } = require('./modules/Room/RoomActivity/activities/PlayActivity/PlayActivityContainer');

  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });

  // // Providers
  // // PeerProvider.whyDidYouRender = {
  // //   customName: PeerProvider,
  // // }

  // // Game
  ChessGame.whyDidYouRender = {
    customName: 'ChessGame',
  };
  StyledChessBoard.whyDidYouRender = {
    customName: 'StyledChessBoard',
  };
  ChessBoard.whyDidYouRender = {
    customName: 'ChessBoard',
  };

  // // Room
  ActivityRoomConsumer.whyDidYouRender = {
    customName: 'ActivityRoomConsumer',
  };
  GenericLayoutDesktopRoomConsumer.whyDidYouRender = {
    customName: 'GenericLayoutDesktopRoomConsumer',
  };
  RoomRoute.whyDidYouRender = {
    customName: 'RoomRoute',
  };
  JoinRoomBouncer.whyDidYouRender = {
    customName: 'JoinRoomBouncer',
  };

  NoActivity.whyDidYouRender = {
    customName: 'NoActivity',
  };
  Room.whyDidYouRender = {
    customName: 'Room',
  };

  PlayActivity.whyDidYouRender = {
    customName: 'PlayActivity',
  };

  PlayActivityContainer.whyDidYouRender = {
    customName: 'PlayActivityContainer',
  };
}
