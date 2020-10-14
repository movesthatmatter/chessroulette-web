/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import { GenericRoom } from './GenericRoom';
import { PeerProvider } from 'src/components/PeerProvider';
import { authenticateAsExistentGuest } from 'src/services/Authentication/resources';
import { GuestUserRecord, PeerRecord, RoomRecord } from 'dstnd-io';
import { quickPair } from 'src/resources/resources';
import { SocketConsumer, SocketProvider } from 'src/components/SocketProvider';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { AuthenticationProvider, selectAuthentication } from 'src/services/Authentication';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { getRandomInt } from 'src/lib/util';
import { Button } from 'src/components/Button';
import { useSelector } from 'react-redux';

export default {
  component: GenericRoom,
  title: 'modules/GenericRoom',
};

const RoomContainer: React.FC<{
  // guestUser: GuestUserRecord;
}> = ({ ...props }) => {
  const [peer, setPeer] = useState<PeerRecord>();
  const [challengeCreated, setChallengeCreated] = useState(false);
  const [room, setRoom] = useState<RoomRecord>();
  const [uniqueKey, setUniqueKey] = useState(0);
  const [show, setShow] = useState(true);

  const auth = useSelector(selectAuthentication);

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

  if (auth.authenticationType === 'none') {
    return null;
  }

  const { user } = auth;

  if (!show) {
    return (
      <Button
        label={show ? 'Simulate Exit' : 'Simulate Enter'}
        onClick={() => {
          setShow(!show);
        }}
      />
    )
  }

  return (
    <SocketConsumer
      onMessage={(msg) => {
        if (msg.kind === 'iam') {
          setPeer(msg.content);
        } else if (msg.kind === 'challengeAccepted') {
          // console.log('challenge accepted', user);
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
          <small>
            <pre>
              User:{' '}
              <b>
                {user.name} ({user.id})
              </b>
            </pre>
            {/* <pre>{JSON.stringify(peer, null, 2)}</pre> */}
          </small>
          <Button
            label="Simulate Refresh"
            onClick={() => {
              // setUniqueKey(getRandomInt(0, 9999));
              setShow(false);
              setTimeout(() => {
                setShow(true)
              }, 500);
            }}
          />
          <Button
            label={show ? 'Simulate Exit' : 'Simulate Enter'}
            onClick={() => {
              setShow(!show);
            }}
          />
          {room && (
            <PeerProvider
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
  );
};

export const playRoomDualView = () =>
  React.createElement(() => {
    const [userA, setUserA] = useState<GuestUserRecord>();
    const [userB, setUserB] = useState<GuestUserRecord>();

    const guestA = {
      id: '1',
      name: 'UserA',
      isGuest: true,
      avatarId: '3',
    } as const;

    const guestB = {
      id: '2',
      name: 'UserA',
      isGuest: true,
      avatarId: '3',
    } as const;

    useEffect(() => {
      (async () => {
        (await authenticateAsExistentGuest({ guestUser: guestA })).map((user) => {
          setUserA(user.guest);
        });

        (await authenticateAsExistentGuest({ guestUser: guestB })).map((user) => {
          setUserB(user.guest);
        });
      })();
    }, []);

    if (!(userA && userB)) {
      return null;
    }

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
              width: '100%',
              height: '500px',
              marginRight: '10px',
              border: '1px solid #efefef',
            }}
          >
            <StorybookReduxProvider
              initialState={{
                authentication: {
                  authenticationType: 'guest',
                  user: userA,
                } as const,
              }}
            >
              <AuthenticationProvider>
                <SocketProvider>
                  <RoomContainer />
                </SocketProvider>
              </AuthenticationProvider>
            </StorybookReduxProvider>
          </div>
          <div
            style={{
              width: '100%',
              height: '500px',
              border: '1px solid #efefef',
            }}
          >
            <StorybookReduxProvider
              initialState={{
                authentication: {
                  authenticationType: 'guest',
                  user: userB,
                } as const,
              }}
            >
              <AuthenticationProvider>
                <SocketProvider>
                  <RoomContainer />
                </SocketProvider>
              </AuthenticationProvider>
            </StorybookReduxProvider>
          </div>
        </div>
      </Grommet>
    );
  });
