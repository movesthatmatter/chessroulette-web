import React from 'react';
import { Page } from 'src/components/Page';
import { Box } from 'grommet';
import { resources } from 'src/resources';
import { useHistory } from 'react-router-dom';
import { selectAuthentication } from 'src/services/Authentication';
import { toRoomUrlPath } from 'src/lib/util';
import { useSelector } from 'react-redux';
import { ConfirmationButton } from 'src/components/ConfirmationButton';
import { FaceTimeSetup } from 'src/components/FaceTimeArea/FaceTimeSetup';
import { ChallengeButtonWidget } from 'src/modules/Games/Chess/components/ChallengeButtonWidget';

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
          <ChallengeButtonWidget 
            buttonLabel="Play a Friend"
            userId={authentication.user.id}
            type="private"
          />
          {/* <Box margin="small">
            <ConfirmationButton
              label="Play A Friend"
              onSubmit={() => {
                resources.createChallenge({
                  userId: authentication.user.id,
                  gameSpecs,
                  type: 'public',
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
          </Box> */}
          {/* <PlayButtonWidget
            buttonLabel="Create a Challenge"
            onSubmit={(gameSpecs) => {
              resources
                .createChallenge({
                  userId: authentication.user.id,
                  gameSpecs,
                  type: 'public',
                })
                .map((challenge) => {
                  console.log('challenge created', challenge);
                  // TODO: do something when the challenge is created
                  // history.push(`/gameroom/${toRoomUrlPath(room)}`);
                });
            }}
          /> */}
          {/* <PlayButtonWidget
            buttonLabel="Play a Friend"
            onSubmit={async (gameSpecs) => {
              (
                await resources.createChallenge({
                  userId: authentication.user.id,
                  gameSpecs,
                  type: 'private',
                })
              ).map((challenge) => {
                console.log('challenge created', challenge);
                // TODO: do something when the challenge is created
                // history.push(`/gameroom/${toRoomUrlPath(room)}`);
              });
            }}
          /> */}
          <Box margin="small">
            <ConfirmationButton
              label="Go Live"
              onSubmit={() => {
                resources.createRoom({
                  userId: authentication.user.id,
                  type: 'public',
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
