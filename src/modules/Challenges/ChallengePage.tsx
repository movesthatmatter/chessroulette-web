import { AsyncResult, ChallengeRecord } from 'dstnd-io';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Page } from 'src/components/Page';
import { resources } from 'src/resources';
import { ChallengeInfo } from './ChallengeInfo';
import { Events } from 'src/services/Analytics';
import { toRoomUrlPath } from 'src/lib/util';
import { useSelector } from 'react-redux';
import { selectAuthentication } from 'src/services/Authentication';

type Props = {
  challenge: ChallengeRecord;
};

export const ChallengePage: React.FC<Props> = ({ challenge }) => {
  const history = useHistory();
  const auth = useSelector(selectAuthentication);

  useEffect(() => {
    Events.trackPageView('Accept Challenge');
  }, []);

  if (auth.authenticationType === 'none') {
    return null;
  }

  return (
    <Page>
      <ChallengeInfo
        challenge={challenge}
        onDeny={() => {
          history.replace('/');
        }}
        onAccept={() => {
          resources
            .acceptChallenge({
              id: challenge.id,
              userId: auth.user.id,
            })
            .map(
              AsyncResult.passThrough((room) => {
                Events.trackFriendlyChallengeAccepted();

                history.replace(toRoomUrlPath(room));
              })
            );
        }}
      />
    </Page>
  );
};
