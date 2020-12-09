import { AsyncResult, ChallengeRecord } from 'dstnd-io';
import { Box } from 'grommet';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Page } from 'src/components/Page';
import { resources } from 'src/resources';
import { ChallengeInfo } from './ChallengeInfo';
import { Events } from 'src/services/Analytics';
import { Peer } from 'src/components/RoomProvider';
import { toRoomUrlPath } from 'src/lib/util';

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
              .map(AsyncResult.passThrough((room) => {
                Events.trackFriendlyChallengeAccepted();

                history.push(toRoomUrlPath(room));
              }));
          }}
        />
      )}
    </Page>
  );
};
