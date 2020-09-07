import React, { useState, useEffect } from 'react';
import { Page } from 'src/components/Page';
import { PlayButtonWidget } from 'src/components/PlayButtonWidget';
import { Box } from 'grommet';
import { resources } from 'src/resources';
import { SocketConsumer } from 'src/components/SocketProvider';
import { PeerRecord, CreateRoomResponse } from 'dstnd-io';
import { useHistory } from 'react-router-dom';
import { AuthenticationConsumer } from 'src/services/Authentication';
import { toRoomUrlPath, urlPathToRoomCredentials } from 'src/lib/util';

type Props = {};

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
            render={({ socket }) => (
              (me && (
                <Box width="medium" alignSelf="center">
                  <PlayButtonWidget
                    type="challenge"
                    onSubmit={async () => {
                      (await resources.createChallenge({
                        peerId: me.id,
                        game: {
                          // Don't hardcode
                          timeLimit: 'bullet',
                        },
                      }))
                        .mapErr((e) => {
                          console.log('error', e);
                        })
                        .map((room) => {
                          // socket.send({
                          //   kind: 'joinRoomRequest',
                          //   content: {
                          //     roomId: room.id,
                          //     code: room.type === 'private' ? room.code : undefined,
                          //   },
                          // });

                          history.push(`/gameroom/${toRoomUrlPath(room)}`);
                        });
                    }}
                  />
                  <PlayButtonWidget
                    type="friendly"
                    onSubmit={async () => {
                      const x = urlPathToRoomCredentials(window.location.href);

                      console.log('x', x);
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
