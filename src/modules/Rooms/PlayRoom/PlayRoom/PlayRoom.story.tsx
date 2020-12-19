import React, { useRef, useState } from 'react';
import { Grommet } from 'grommet';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { defaultTheme } from 'src/theme';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { chessGameActions, ChessGameState, ChessGameStateStarted, GuestUserRecord } from 'dstnd-io';
import { action } from '@storybook/addon-actions';
import { RoomWithPlayActivity } from 'src/providers/PeerProvider';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { PeerProvider } from 'src/providers/PeerProvider';
import { SocketProvider } from 'src/providers/SocketProvider';
import { PlayRoom } from './PlayRoom';
import { toISODateTime } from 'src/lib/date/ISODateTime';

export default {
  component: PlayRoom,
  title: 'modules/Rooms/PlayRoom',
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
            <StorybookReduxProvider
              initialState={{
                authentication: {
                  authenticationType: 'guest',
                  user: {
                    ...me.user,
                    isGuest: true,
                  } as GuestUserRecord,
                },
              }}
            >
              <SocketProvider>
                <PeerProvider>
                  <PlayRoom
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
                    onOfferCanceled={action('onOfferCancel')}
                    onTimerFinished={action('onTimerFinished')}
                    onGameStatusCheck={action('onStatusCheck')}
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
                  timeLimit: 'blitz',
                }),
              },
            }) as RoomWithPlayActivity
          );

          return (
            <StorybookReduxProvider
              initialState={{
                authentication: {
                  authenticationType: 'guest',
                  user: {
                    ...me.user,
                    isGuest: true,
                  } as GuestUserRecord,
                },
              }}
            >
              <PlayRoom
                room={publicRoom}
                onMove={(move) => {
                  console.log('moved', move);
                  setPublicRoom((prev) => ({
                    ...prev,
                    activity: {
                      ...prev.activity,
                      game: chessGameActions.move(prev.activity.game as ChessGameStateStarted, {
                        move,
                        movedAt: toISODateTime(new Date()),
                      }),
                    },

                    me: prev.me.id === me.id ? opponent : me,
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
                onOfferCanceled={action('onOfferCancel')}
                onTimerFinished={action('onTimerFinished')}
                onGameStatusCheck={action('onStatusCheck')}
              />
            </StorybookReduxProvider>
          );
        })
      }
    />
  </Grommet>
);
