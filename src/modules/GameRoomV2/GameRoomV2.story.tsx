/* eslint-disable import/no-extraneous-dependencies */
import React, { useRef, useState } from 'react';
import { Grommet } from 'grommet';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { defaultTheme } from 'src/theme';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { Page } from 'src/components/Page';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { chessGameActions, ChessGameState, ChessGameStateStarted } from 'dstnd-io';
import { action } from '@storybook/addon-actions';
import { GameRoomV2 } from './GameRoomV2';
import { RoomWithPlayActivity } from 'src/components/RoomProvider';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { PeerProvider } from 'src/components/PeerProvider';
import { SocketProvider } from 'src/components/SocketProvider';

export default {
  component: GameRoomV2,
  title: 'modules/GameRoomV2/GameRoomV2',
};

const peerMock = new PeerMocker();
const roomMocker = new RoomMocker();

export const defaultStory = () => (
  <Grommet theme={defaultTheme} full>
    <WithLocalStream
      render={(stream) =>
        React.createElement(() => {
          const me = peerMock.withChannels({
            streaming: {
              on: true,
              type: 'audio-video',
              stream,
            },
          });

          const opponent = peerMock.withChannels({
            streaming: {
              on: true,
              type: 'audio-video',
              stream,
            },
          });

          const homeColor = 'white';

          const [currentGame] = useState<ChessGameState>(
            chessGameActions.prepareGame({
              players: [me.user, opponent.user],
              preferredColor: homeColor,
              timeLimit: 'blitz',
            })
          );

          const publicRoom = roomMocker.withProps({
            me,
            peers: {
              [opponent.id]: opponent,
            },
            name: 'Valencia',
            type: 'public',
            activity: {
              type: 'play',
              game: currentGame,
            },
          }) as RoomWithPlayActivity;

          return (
            <StorybookReduxProvider>
              <SocketProvider>
                <PeerProvider user={me.user} iceServers={[]}>
                  <GameRoomV2
                    room={publicRoom}
                    onMove={action('on move')}
                    onAbort={action('onAbort')}
                    onDrawAccepted={action('onDrawAccepted')}
                    onDrawDenied={action('onDrawDenied')}
                    onOfferDraw={action('onOfferDraw')}
                    onRematchAccepted={action('onRematchAccepted')}
                    onRematchDenied={action('onRematchDenied')}
                    onRematchOffer={action('onRematchOffer')}
                    onResign={action('onResign')}
                  />
                </PeerProvider>
              </SocketProvider>
            </StorybookReduxProvider>
          );
        })
      }
    />
  </Grommet>
);

export const withSwitchingSides = () => (
  <Grommet theme={defaultTheme} full>
    <WithLocalStream
      render={(stream) =>
        React.createElement(() => {
          const me = useRef(
            peerMock.withChannels({
              streaming: {
                on: true,
                type: 'audio-video',
                stream,
              },
            })
          ).current;

          const opponent = useRef(
            peerMock.withChannels({
              streaming: {
                on: true,
                type: 'audio-video',
                stream,
              },
            })
          ).current;

          const [publicRoom, setPublicRoom] = useState(
            roomMocker.withProps({
              me,
              peers: {
                [opponent.id]: opponent,
              },
              name: 'Valencia',
              type: 'public',
              activity: {
                type: 'play',
                game: chessGameActions.prepareGame({
                  players: [me.user, opponent.user],
                  preferredColor: 'white',
                  timeLimit: 'bullet',
                }),
              },
            }) as RoomWithPlayActivity
          );

          return (
            <StorybookReduxProvider>
              {/* <Page> */}
              <GameRoomV2
                // key={publicRoom.me.id}
                room={publicRoom}
                onMove={(move) => {
                  console.log('moved', move);
                  setPublicRoom((prev) => ({
                    ...prev,
                    activity: {
                      ...prev.activity,
                      game: chessGameActions.move(prev.activity.game as ChessGameStateStarted, {
                        move,
                      }),
                    },

                    me: prev.me.id === me.id ? opponent : me,
                  }));

                  // setHomeColor((prev) => otherChessColor(prev));
                }}
                onAbort={action('onAbort')}
                onDrawAccepted={action('onDrawAccepted')}
                onDrawDenied={action('onDrawDenied')}
                onOfferDraw={action('onOfferDraw')}
                onRematchAccepted={action('onRematchAccepted')}
                onRematchDenied={action('onRematchDenied')}
                onRematchOffer={action('onRematchOffer')}
                onResign={action('onResign')}
              />
              {/* </Page> */}
            </StorybookReduxProvider>
          );
        })
      }
    />
  </Grommet>
);

export const asPageWithStartedGame = () => (
  <Grommet theme={defaultTheme} full>
    <WithLocalStream
      render={(stream) =>
        React.createElement(() => {
          const me = peerMock.withChannels({
            streaming: {
              on: true,
              type: 'audio-video',
              stream,
            },
          });

          const opponent = peerMock.withChannels({
            streaming: {
              on: true,
              type: 'audio-video',
              stream,
            },
          });

          const homeColor = 'white';

          const [publicRoom] = useState(
            roomMocker.withProps({
              me,
              peers: {
                [opponent.id]: opponent,
              },
              name: 'Valencia',
              type: 'public',
              activity: {
                type: 'play',
                game: chessGameActions.prepareGame({
                  players: [me.user, opponent.user],
                  preferredColor: homeColor,
                  timeLimit: 'bullet',
                  pgn: `
                  1. e4 c5 2. Nf3 d6 3. Bb5+ Nc6 4. O-O Bd7 5. Re1 Nf6 6. c3 a6 7. Ba4 b5 8. Bc2
                  e5 9. h3 Be7 10. d4 O-O 11. d5 Na5 12. Nbd2 g6 13. b4 Nb7 14. a4 Qc7 15. Nf1 Nh5
                  16. Bh6 Ng7 17. Ng3 f6 18. Qd2 Rfc8 19. Ra2 a5 20. Rea1 axb4 21. cxb4 bxa4 22.
                  Bxa4 Bxa4 23. Rxa4 Rxa4 24. Rxa4 cxb4 25. Rxb4 Nc5 26. Be3 Qd7 27. Rc4 Rb8 28.
                  Bxc5 dxc5 29. Nf1 Ne8 30. Qc2 Qb5 31. N3d2 Qb2 32. Qa4 Kf7 33. Rc2 Qb4 34. Qd7
                  Nd6 35. Ne3 Kf8 36. Kh2 Rd8 37. Qg4 Qd4 38. Nec4 f5 39. Qe2 Nxe4 40. Nxe4 Qxe4
                  41. Qxe4 fxe4 42. Rd2 Bg5 43. Rd1 Rb8 44. Kg1 Rb4 45. Nxe5 c4 46. Nc6 Rb2 47.
                  Nd4 c3 48. Re1 c2 49. Nxc2 Rxc2 50. Rxe4 Rd2 51. g3 Be7 52. Rf4+ Kg7 53. Kg2 Bc5
                  54. h4 Rxd5 55. Rc4 Kf6 56. Rc2 Kf5 57. Ra2 Bb4 58. Rb2 Bc3 59. Rc2 Rd3 60. Kf1
                  Bd4 61. Kg2 Rb3 62. Rc7 h6 63. Rf7+ Ke6 64. Rf4 Bb6 65. Rf8 Rb2 66. Rf3 g5 67.
                  hxg5 hxg5 68. Rf8 Bc5 69. Rf3 Ra2 70. Kg1 Ra7 71. Kg2 Ke5 72. Kh3 Ra4 73. Kg2
                  Ra2 74. Rf7 Ke4 75. Rf3 Bd4 76. Rf8 Kd3 77. Rf5 Ke4 78. Rxg5 Rxf2+ 79. Kh3 Rf8
                  80. Rg4+ Ke3 81. Rf4 Rg8 82. Rg4 Bg7 83. Kg2 Kd3 84. Rg6 Ke4 85. Rg5 Kd4 86. Kg1
                  Kd3 87. Kg2 Ke4 88. Rg4+ Kf5 89. Rf4+ Kg5 90. Kf3 Ra8 91. Rg4+ Kf6 92. Rf4+ Ke6
                  93. Kg2 Be5 94. Rf3 Rh8 95. Kg1 Kd5 96. Kg2 Ke4 97. Rb3 Rc8 98. Kh3 Rc2 99. Kg4
                  Rg2 100. Ra3 Rg1 101. Rb3 Bd6 102. Rc3 Kd4 103. Rb3 Bc5 104. Rf3 Bb4 105. Rf4+
                  Kc3 106. Rf3+ Kd2 107. Kf5 Ke2 108. Rb3 Bd2 109. Ke4 Ra1 110. Kf5 Be3 111. Kg4
                  Ra4+ 112. Kh3 Ra7 113. Rb5 Rf7 114. Kg4 Rg7+ 115. Kh3 Bf2 116. Rb3 Kf1 117. Rb1+
                  Be1 118. Rb3 Rh7+ 119. Kg4 Kg2 120. Kf4 Rf7+ 121. Ke4 Bxg3 122. Rb2+ Kh3 123.
                  Rb3 Kg4 124. Kd5 Bf4 125. Ke6 Rf8 126. Rb1 Re8+ 127. Kd7 Re5 128. Rd1 Kf5 129.
                  Kc6 Re2 130. Rd8 Rc2+ 131. Kb5 Ke6 132. Rd4 Bd6 133. Rc4 Rb2+ 134. Kc6 Rb8 135.
                  Rh4 Rc8+ 136. Kb7 Rc1 137. Kb6 Bf8 138. Kb5 Rc5+ 139. Kb6 Rc1 140. Kb5 Bd6 141.
                  Rc4 Ra1 142. Kc6 Be5 143. Rc2 Ra8 144. Rc4 Rd8
                  `,
                }),
              },
            }) as RoomWithPlayActivity
          );

          return (
            <StorybookReduxProvider>
              <GameRoomV2
                room={publicRoom}
                onMove={action('on move')}
                onAbort={action('onAbort')}
                onDrawAccepted={action('onDrawAccepted')}
                onDrawDenied={action('onDrawDenied')}
                onOfferDraw={action('onOfferDraw')}
                onRematchAccepted={action('onRematchAccepted')}
                onRematchDenied={action('onRematchDenied')}
                onRematchOffer={action('onRematchOffer')}
                onResign={action('onResign')}
              />
            </StorybookReduxProvider>
          );
        })
      }
    />
  </Grommet>
);

export const asPageWithFinishedGame = () => (
  <Grommet theme={defaultTheme} full>
    <WithLocalStream
      render={(stream) =>
        React.createElement(() => {
          const me = peerMock.withChannels({
            streaming: {
              on: true,
              type: 'audio-video',
              stream,
            },
          });

          const opponent = peerMock.withChannels({
            streaming: {
              on: true,
              type: 'audio-video',
              stream,
            },
          });

          const homeColor = 'white';

          const [publicRoom] = useState(
            roomMocker.withProps({
              me,
              peers: {
                [opponent.id]: opponent,
              },
              name: 'Valencia',
              type: 'public',
              activity: {
                type: 'play',
                game: chessGameActions.prepareGame({
                  players: [me.user, opponent.user],
                  preferredColor: homeColor,
                  timeLimit: 'bullet',
                  pgn: '1. e4 e5 2. Qf3 Na6 3. Bc4 h6 4. Qxf7#',
                }),
              },
            }) as RoomWithPlayActivity
          );

          return (
            <StorybookReduxProvider>
              <GameRoomV2
                room={publicRoom}
                onMove={action('on move')}
                onAbort={action('onAbort')}
                onDrawAccepted={action('onDrawAccepted')}
                onDrawDenied={action('onDrawDenied')}
                onOfferDraw={action('onOfferDraw')}
                onRematchAccepted={action('onRematchAccepted')}
                onRematchDenied={action('onRematchDenied')}
                onRematchOffer={action('onRematchOffer')}
                onResign={action('onResign')}
              />
            </StorybookReduxProvider>
          );
        })
      }
    />
  </Grommet>
);
