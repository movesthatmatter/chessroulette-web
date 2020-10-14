/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import { GenericRoom } from './GenericRoom';
import { PeerProvider } from 'src/components/PeerProvider';
import { authenticateAsExistentGuest } from 'src/services/Authentication/resources';
import { GuestUserRecord, PeerRecord, RoomRecord } from 'dstnd-io';
import { quickPair } from 'src/resources/resources';
import { SocketConsumer, SocketProvider } from 'src/components/SocketProvider';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { AuthenticationProvider } from 'src/services/Authentication';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { getRandomInt } from 'src/lib/util';
import { Button } from 'src/components/Button';

export default {
  component: GenericRoom,
  title: 'modules/GenericRoom',
};

const ProvidedRoom: React.FC<{
  guestUser: GuestUserRecord;
}> = ({ guestUser, ...props }) => {
  const [user, setUser] = useState<GuestUserRecord>();
  const [peer, setPeer] = useState<PeerRecord>();
  const [challengeCreated, setChallengeCreated] = useState(false);
  const [room, setRoom] = useState<RoomRecord>();
  const [uniqueKey, setUniqueKey] = useState(0)

  useEffect(() => {
    (async () => {
      (await authenticateAsExistentGuest({ guestUser })).map((user) => {
        setUser(user.guest);
      });
    })();
  }, []);

  useEffect(() => {
    if (!peer || challengeCreated) {
      return;
    }

    setTimeout(() => {
      quickPair({
        userId: peer.user.id,
        gameSpecs: {
          timeLimit: 'bullet',
          preferredColor: 'white',
        },
      }).map((r) => {
        if (r.matched) {
          setRoom(r.room);
        }

        setChallengeCreated(true);
      });
    }, getRandomInt(200, 1000));
  }, [peer]);

  if (!user) {
    return null;
  }

  return (
    <StorybookReduxProvider
      initialState={{
        authentication: {
          authenticationType: 'guest',
          user,
        } as const,
      }}
    >
      <AuthenticationProvider>
        <SocketProvider>
          <SocketConsumer
            onMessage={(msg) => {
              if (msg.kind === 'iam') {
                setPeer(msg.content);
              } else if (msg.kind === 'challengeAccepted') {
                console.log('challenge accepted', user);
                setRoom(msg.content.room);
              }
            }}
            onReady={(s) => {
              s.send({
                kind: 'userIdentification',
                content: {
                  userId: user.id,
                },
              });
            }}
            render={() => (
              <>
                <pre>
                  User:{' '}
                  <b>
                    {user.name} ({user.id})
                  </b>
                </pre>
                <Button
                  label="Simulate Refresh" 
                  onClick={() => {
                    setUniqueKey(getRandomInt(0, 9999));
                  }}
                />
                {room && (
                  <PeerProvider
                    key={uniqueKey}
                    roomCredentials={{
                      id: room.id,
                      ...(room.type === 'private' && {
                        code: room.code,
                      }),
                    }}
                    user={user}
                  >
                    <GenericRoom />
                  </PeerProvider>
                )}
              </>
            )}
          />
        </SocketProvider>
      </AuthenticationProvider>
    </StorybookReduxProvider>
  );
};

export const playRoomDualView = () =>
  React.createElement(() => {
    const [roomAKey, setRoomAKey] = useState(getRandomInt(0, 9999));
    const [roomBKey, setRoomBKey] = useState(getRandomInt(0, 9999));

    return (
      <Grommet theme={defaultTheme}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <div
            style={{
              // width: '500px',
              width: '100%',
              height: '500px',
              marginRight: '10px',
            }}
          >
            <ProvidedRoom
              key={roomAKey}
              guestUser={{
                id: '1',
                name: 'UserA',
                isGuest: true,
                avatarId: '3',
              }}
            />
          </div>
          <div
            style={{
              // width: '500px',
              width: '100%',
              height: '500px',
            }}
          >
            <ProvidedRoom
              key={roomBKey}
              guestUser={{
                id: '2',
                name: 'UserA',
                isGuest: true,
                avatarId: '3',
              }}
            />
          </div>
        </div>
      </Grommet>
    );
  });
