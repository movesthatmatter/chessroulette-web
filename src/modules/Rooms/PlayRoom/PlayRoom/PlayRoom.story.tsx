import React, { useEffect, useState } from 'react';
import { Grommet } from 'grommet';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { defaultTheme } from 'src/theme';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import {
  AsyncResult,
  chessGameActions,
  ChessGameStateStarted,
  GameRecord,
  GuestUserRecord,
  UserRecord,
} from 'dstnd-io';
import { action } from '@storybook/addon-actions';
import { Peer, RoomWithPlayActivity } from 'src/providers/PeerProvider';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { PeerProvider } from 'src/providers/PeerProvider';
import { SocketProvider } from 'src/providers/SocketProvider';
import { PlayRoom } from './PlayRoom';
import { authenticateAsNewGuest } from 'src/services/Authentication/resources';
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

          const [currentGame] = useState<GameRecord>({
            id: '1',
            ...chessGameActions.prepareGame({
              players: [me.user, opponent.user],
              preferredColor: homeColor,
              timeLimit: 'blitz',
            }),
          });

          const publicRoom = roomMocker.withProps({
            me,
            peers: {
              [opponent.id]: opponent,
            },
            name: 'Valencia',
            type: 'public',
            activity: {
              type: 'play',
              gameId: currentGame.id,
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

                // TODO: the game will be added here
              }}
            >
              <SocketProvider>
                <PeerProvider>
                  <PlayRoom
                    room={publicRoom}
                    game={currentGame}
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
          const [me, setMe] = useState<Peer>();
          const [opponent, setOpponent] = useState<Peer>();
          const [game, setGame] = useState<GameRecord>();
          const [publicRoom, setPublicRoom] = useState<RoomWithPlayActivity>();

          const userToPeer = (user: UserRecord) => ({
            user: user,
            id: user.id,
            joinedRoomId: null,
            joinedRoomAt: null,
            hasJoinedRoom: false,
            connection: {
              // This shouldn't be so
              // there's no connetion with myself :)
              channels: {
                data: { on: true },
                streaming: { on: false },
              },
            },
          } as const);

          useEffect(() => {
            AsyncResult.all(
              authenticateAsNewGuest(),
              authenticateAsNewGuest()
            ).map(([myUser, opponentUser]) => {
              const me = userToPeer(myUser.guest);
              const opponent = userToPeer(opponentUser.guest);

              const nextGame = {
                id: '1',
                ...chessGameActions.prepareGame({
                  players: [me.user, opponent.user],
                  preferredColor: 'white',
                  timeLimit: 'blitz',
                }),
              };

              const nextRoom = roomMocker.withProps({
                me,
                peers: {
                  [opponent.id]: opponent,
                },
                name: 'Valencia',
                type: 'public',
                activity: {
                  type: 'play',
                  gameId: nextGame.id,
                },
              }) as RoomWithPlayActivity;

              setMe(me);
              setOpponent(opponent);
              setGame(nextGame);
              setPublicRoom(nextRoom);
            });
          }, []);

          if (!(me && opponent && publicRoom && game)) {
            return (
              <div>
                Users need to join first!
              </div>
            )
          }

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
                game={game}
                onMove={(move) => {
                  // TODO this will be done via redux actions

                  setGame((prev) => ({
                    ...prev as GameRecord,
                    ...chessGameActions.move(prev as ChessGameStateStarted, {
                      move,
                      movedAt: toISODateTime(new Date()),
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
