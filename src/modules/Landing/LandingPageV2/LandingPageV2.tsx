import React, { useState, useEffect } from 'react';
import { Page } from 'src/components/Page';
import { PlayButtonWidget } from 'src/components/PlayButtonWidget';
import { Box } from 'grommet';
import { resources } from 'src/resources';
import { SocketConsumer } from 'src/components/SocketProvider';
import { PeerRecord, CreateRoomResponse } from 'dstnd-io';
import { useHistory } from 'react-router-dom';
import {
  AuthenticationConsumer,
  selectAuthentication,
} from 'src/services/Authentication';
import { toRoomUrlPath, urlPathToRoomCredentials } from 'src/lib/util';
import { useSelector } from 'react-redux';

type Props = {};

export const LandingPageV2: React.FC<Props> = () => {
  // TODO: All of this Peer Gather could be removed if
  //  I could createa  challenge with the User id instead of
  //  the Peer Id
  // const [me, setMe] = useState<PeerRecord | undefined>();
  const authentication = useSelector(selectAuthentication);
  const history = useHistory();
  // const

  // This should never happen
  if (authentication.authenticationType === 'none') {
    return null;
  }

  return (
    <Page>
      <Box>
        <Box width="medium" alignSelf="center">
          <PlayButtonWidget
            type="challenge"
            onSubmit={async () => {
              (
                await resources.createChallenge({
                  peerId: authentication.user.id,
                  game: {
                    // Don't hardcode
                    timeLimit: 'bullet',
                  },
                })
              ).map((room) => {
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
      </Box>
    </Page>
  );
};
