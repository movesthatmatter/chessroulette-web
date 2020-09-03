import React, { useState } from 'react';
import { Page } from 'src/components/Page';
import { PlayButtonWidget } from 'src/components/PlayButtonWidget';
import { Box } from 'grommet';
import { resources } from 'src/resources';
import { SocketConsumer } from 'src/components/SocketProvider';
import { PeerRecord, CreateRoomResponse } from 'dstnd-io';
import { useHistory } from 'react-router-dom';
import { AuthenticationConsumer } from 'src/services/Authentication';

type Props = {};

const toRoomPath = (room: CreateRoomResponse) =>
  `${room.id}${room.type === 'private' ? `/${room.code}` : ''}`;

export const LandingPageV2: React.FC<Props> = () => {
  // TODO: All of this Peer Gather could be removed if
  //  I could createa  challenge with the User id instead of
  //  the Peer Id
  const [me, setMe] = useState<PeerRecord | undefined>();
  const history = useHistory();
  // const

  // For now the Landing Page simply impersonates a GameRoom
  return (
    <Page>
      <Box>
        <AuthenticationConsumer renderAuthenticated={(auth) => (
          <SocketConsumer
            onMessage={(msg) => {
              if (msg.kind === 'myStats') {
                setMe(msg.content);
              }
            }}
            render={() => (
              (me && (
                <Box width="medium" alignSelf="center">
                  <PlayButtonWidget
                    type="challenge"
                    onSubmit={async () => {
                      (await resources.createChallenge({
                        peerId: me.id,
                        game: {
                          // Don't hardcode
                          timeLimit: 'rapid',
                        },
                      }))
                        .mapErr((e) => {
                          console.log('error', e);
                        })
                        .map((room) => {
                          history.push(`/gameroom/${toRoomPath(room)}`);
                        });
                    }}
                  />
                  <PlayButtonWidget
                    type="friendly"
                    onSubmit={async () => {
                      // (await resources.createChallenge({ peerId: me.id }))
                      //   .map((room) => {
                      //     history.push(`/gameroom/${toRoomPath(room)}`);
                      //   });
                      // console.log('join challenge');
                    }}
                  />
                </Box>
              ))
            )}
            onReady={(socket) => {
              socket.send({
                kind: 'userIdentification',
                content: { userId: auth.user.id },
              });

              socket.send({ kind: 'whoami', content: '' });
            }}
          />
        )}
        />
      </Box>
    </Page>
  );
};
