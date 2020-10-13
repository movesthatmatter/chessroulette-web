/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import { JoinFirstAvailableRoomHelper } from 'src/storybook/JoinFirstAvailableRoomHelper';
import { GenericRoom } from './GenericRoom';
import { PeerProvider } from 'src/components/PeerProvider';
import { authenticateAsGuest } from 'src/services/Authentication/resources';
import { ChallengeRecord, PeerRecord, RoomRecord, UserRecord } from 'dstnd-io';
import { acceptChallenge, createChallenge } from 'src/resources/resources';
import { SocketConsumer, SocketProvider } from 'src/components/SocketProvider';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { AuthenticationProvider } from 'src/services/Authentication';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';

export default {
  component: GenericRoom,
  title: 'modules/GenericRoom',
};

export const playRoomDualView = () =>
  React.createElement(() => {
    const [userA, setUserA] = useState<UserRecord>();
    const [userB, setUserB] = useState<UserRecord>();
    const [peerA, setPeerA] = useState<PeerRecord>();
    const [peerB, setPeerB] = useState<PeerRecord>();
    const [challenge, setChallenge] = useState<ChallengeRecord>();
    const [room, setRoom] = useState<RoomRecord>();

    useEffect(() => {
      (async () => {
        (await authenticateAsGuest()).map((user) => {
          setUserA(user.guest);
        });

        (await authenticateAsGuest()).map((user) => {
          setUserB(user.guest);
        });
      })();
    }, []);

    useEffect(() => {
      if (!peerA) {
        return;
      }

      createChallenge({
        type: 'private',
        gameSpecs: {
          timeLimit: 'bullet',
          preferredColor: 'white',
        },
        userId: peerA.id,
      }).map(setChallenge);
    }, [peerA]);

    useEffect(() => {
      if (!(peerB && challenge)) {
        return;
      }

      acceptChallenge({
        id: challenge.id,
        userId: peerB.id,
      }).map(setRoom);
    }, [peerB, challenge]);

    if (!(userA && userB)) {
      return null;
    }

    return (
      <Grommet theme={defaultTheme}>
        <>
          {/* <pre>
            Challenge: <b>{challenge?.slug}</b>
          </pre>
          <pre>
            Room: <b>{room?.name}</b>
          </pre> */}
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
              <StorybookReduxProvider>
                <AuthenticationProvider>
                  <SocketProvider>
                    <SocketConsumer
                      onMessage={(msg) => {
                        if (msg.kind === 'iam') {
                          setPeerA(msg.content);
                        }
                      }}
                      onReady={(s) => {
                        s.send({
                          kind: 'userIdentification',
                          content: {
                            userId: userA.id,
                          },
                        });
                      }}
                      render={() => (
                        <>
                          <pre>
                            User A:{' '}
                            <b>
                              {userA.name} ({userA.id})
                            </b>
                          </pre>
                          {room && (
                            <PeerProvider
                              roomCredentials={{
                                id: room.id,
                                ...(room.type === 'private' && {
                                  code: room.code,
                                }),
                              }}
                              user={userA}
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
            </div>
            <div
              style={{
                // width: '500px',
                width: '100%',
                height: '500px',
              }}
            >
              <StorybookReduxProvider>
                <AuthenticationProvider>
                  <SocketProvider>
                    <SocketConsumer
                      onMessage={(msg) => {
                        if (msg.kind === 'iam') {
                          setPeerB(msg.content);
                        }
                      }}
                      onReady={(s) => {
                        s.send({
                          kind: 'userIdentification',
                          content: {
                            userId: userB.id,
                          },
                        });
                      }}
                      render={() => (
                        <>
                          <pre>
                            User B:{' '}
                            <b>
                              {userB.name} ({userB.id})
                            </b>
                          </pre>
                          {room && (
                            <PeerProvider
                              roomCredentials={{
                                id: room.id,
                                ...(room.type === 'private' && {
                                  code: room.code,
                                }),
                              }}
                              user={userB}
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
            </div>
          </div>
        </>
      </Grommet>
    );

    // return (
    //   <>
    //     <PeerProvider roomCredentials={roomCredentials} user={auth.user}>
    //       <GenericRoom />
    //     </PeerProvider>
    //     <PeerProvider roomCredentials={roomCredentials} user={auth.user}>
    //       <GenericRoom />
    //     </PeerProvider>
    //   </>
    // );
  });
