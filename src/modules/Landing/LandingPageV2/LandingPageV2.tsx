import React from 'react';
import { Page } from 'src/components/Page';
import { PlayButtonWidget } from 'src/components/PlayButtonWidget';
import { Box } from 'grommet';
import { resources } from 'src/resources';
import { useHistory } from 'react-router-dom';
import { selectAuthentication } from 'src/services/Authentication';
import { toRoomUrlPath, urlPathToRoomCredentials } from 'src/lib/util';
import { useSelector } from 'react-redux';

type Props = {};

export const LandingPageV2: React.FC<Props> = () => {
  const authentication = useSelector(selectAuthentication);
  const history = useHistory();

  // This should never happen
  if (authentication.authenticationType === 'none') {
    return null;
  }

  return (
    <Page>
      <Box>
        <Box width="medium" alignSelf="center">
          <PlayButtonWidget
            buttonLabel="Create a Challenge"
            onSubmit={async (game) => {
              (
                await resources.createChallenge({
                  peerId: authentication.user.id,
                  game,
                })
              ).map((room) => {
                history.push(`/gameroom/${toRoomUrlPath(room)}`);
              });
            }}
          />
          <PlayButtonWidget
            buttonLabel="Create A Private Room"
            onSubmit={async () => {
              const x = urlPathToRoomCredentials(window.location.href);

              // console.log('x', x);
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
