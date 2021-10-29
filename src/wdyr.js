if (false && process.env.NODE_ENV === 'development') {
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

  const {
    AnalysisActivity,
  } = require('./modules/Room/RoomActivity/activities/AnalysisActivity/AnalysisActivity');
  const {
    AnalysisBoard,
  } = require('./modules/Room/RoomActivity/activities/AnalysisActivity/components/AnalysisBoard');
  const {
    AnalysisPanel,
  } = require('./modules/Room/RoomActivity/activities/AnalysisActivity/components/AnalysisPanel');
  const {
    AnalysisStateWidget,
  } = require('./modules/Room/RoomActivity/activities/AnalysisActivity/components/AnalysisStateWidget');
  const {
    FenBox,
  } = require('./modules/Room/RoomActivity/activities/AnalysisActivity/components/FenBox');
  const {
    PgnBox,
  } = require('./modules/Room/RoomActivity/activities/AnalysisActivity/components/PgnBox');

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

  // Play

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

  // Analysis
  AnalysisBoard.whyDidYouRender = {
    customName: 'AnalysisBoard',
  };

  AnalysisActivity.whyDidYouRender = {
    customName: 'AnalysisActivity',
  };

  AnalysisPanel.whyDidYouRender = {
    customName: 'AnalysisPanel',
  };

  PgnBox.whyDidYouRender = {
    customName: 'PgnBox',
  };

  FenBox.whyDidYouRender = {
    customName: 'FenBox',
  };

  AnalysisStateWidget.whyDidYouRender = {
    customName: 'AnalysisStateWidget',
  };
}
