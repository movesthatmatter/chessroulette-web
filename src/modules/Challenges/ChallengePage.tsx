import { ChallengeRecord } from 'dstnd-io';
import { Box } from 'grommet';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Page } from 'src/components/Page';
import { toRoomUrlPath } from 'src/lib/util';
import { resources } from 'src/resources';
import { ChallengeInfo } from './ChallengeInfo';
import { Events } from 'src/services/Analytics';
import { Peer } from 'src/components/RoomProvider';

type Props = {
  challenge: ChallengeRecord;
  myPeer?: Peer;
};

export const ChallengePage: React.FC<Props> = ({ challenge, myPeer }) => {
  const history = useHistory();

  useEffect(() => {
    Events.trackPageView('Accept Challenge');
  }, []);

  return (
    <Page>
      <Box align="center" justify="center">
        {myPeer && (
          <ChallengeInfo
            challenge={challenge}
            onDeny={() => {
              history.replace('/');
            }}
            onAccept={() => {
              resources
                .acceptChallenge({
                  id: challenge.id,
                  userId: myPeer.user.id,
                })
                .map((room) => {
                  Events.trackFriendlyChallengeAccepted();

                  history.push(toRoomUrlPath(room));
                });
            }}
          />
        )}
      </Box>
    </Page>
  );
};
