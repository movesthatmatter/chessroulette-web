import React from 'react';
import { Page } from 'src/components/Page';
import { PlayButtonWidget } from 'src/components/PlayButtonWidget';
import { Box } from 'grommet';
import { resources } from 'src/resources';
import { useHistory } from 'react-router-dom';
import { selectAuthentication } from 'src/services/Authentication';
import { toRoomUrlPath } from 'src/lib/util';
import { useSelector } from 'react-redux';
import { ConfirmationButton } from 'src/components/ConfirmationButton';
import { FaceTimeSetup } from 'src/components/FaceTimeArea/FaceTimeSetup';

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
          <Box margin="small">
            <ConfirmationButton
              label="Go Live"
              onSubmit={() => {
                resources.createRoom({
                  userId: authentication.user.id,
                  type: 'public',
                })
                  .mapErr((e) => {
                    console.log('e', e);
                  })
                  .map((room) => {
                    history.push(`/room/${toRoomUrlPath(room)}`);
                  });
              }}
              confirmationPopupContent={(
                <>
                  <FaceTimeSetup onUpdated={() => {
                    console.log('Facetime Enabled');
                  }}
                  />
                </>
            )}
            />
          </Box>
          <Box margin="small">
            <ConfirmationButton
              label="Create Private Room"
              onSubmit={() => {
                resources.createRoom({
                  userId: authentication.user.id,
                  type: 'private',
                })
                  .map((room) => {
                    history.push(`/room/${toRoomUrlPath(room)}`);
                  });
              }}
              confirmationPopupContent={(
                <>
                  <FaceTimeSetup onUpdated={() => {
                    console.log('Facetime Enabled');
                  }}
                  />
                </>
            )}
            />
          </Box>
          {/* <PlayButtonWidget
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
          /> */}
        </Box>
      </Box>
    </Page>
  );
};
