/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { Grommet } from 'grommet';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { defaultTheme } from 'src/theme';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { Page } from 'src/components/Page';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { chessGameActions, ChessGameState, ChessGameStateStarted, ChessGameColor } from 'dstnd-io';
import { action } from '@storybook/addon-actions';
import { GameRoomV2 } from './GameRoomV2';
import { otherChessColor } from '../Games/Chess/util';
import { RoomWithPlayActivity } from 'src/components/RoomProvider';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';

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
          );
        })
      }
    />
  </Grommet>
);

export const asPage = () => (
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
                  preferredColor: homeColor,
                  timeLimit: 'bullet',
                }),
              },
            }) as RoomWithPlayActivity
          );

          return (
            <StorybookReduxProvider>
              <Page>
                <GameRoomV2
                  room={publicRoom}
                  onMove={(nextMove) => {
                    setPublicRoom((prev) => ({
                      ...prev,
                      game: chessGameActions.move(prev.activity.game as ChessGameStateStarted, {
                        move: nextMove,
                      }),
                    }));
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
              </Page>
            </StorybookReduxProvider>
          );
        })
      }
    />
  </Grommet>
);

export const asPageWithSwitchingSides = () => (
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

          const [homeColor, setHomeColor] = useState<ChessGameColor>('white');

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
                  preferredColor: homeColor,
                  timeLimit: 'bullet',
                }),
              },
            }) as RoomWithPlayActivity
          );

          return (
            <StorybookReduxProvider>
              <Page>
                <GameRoomV2
                  room={publicRoom}
                  onMove={(move) => {
                    setPublicRoom((prev) => ({
                      ...prev,
                      game: chessGameActions.move(prev.activity.game as ChessGameStateStarted, {
                        move,
                      }),
                    }));

                    setHomeColor((prev) => otherChessColor(prev));
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
              </Page>
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
              <Page>
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
              </Page>
            </StorybookReduxProvider>
          );
        })
      }
    />
  </Grommet>
);
