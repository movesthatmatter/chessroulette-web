import { ChallengeRecord, RoomRecord } from 'dstnd-io';
import { Box } from 'grommet';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { Page } from 'src/components/Page';
import { SocketConsumer } from 'src/components/SocketProvider';
import { toRoomUrlPath } from 'src/lib/util';
import { resources } from 'src/resources';
import { selectAuthentication } from 'src/services/Authentication';
import { ChallengeInfo } from './ChallengeInfo';
import { GenericRoom } from 'src/modules/GenericRoom';

type Props = {};

export const ChallengePage: React.FC<Props> = (props) => {
  const params = useParams<{ slug: string }>();
  const [challenge, setChallenge] = useState<ChallengeRecord>();
  const [room, setRoom] = useState<RoomRecord>();

  const history = useHistory();
  const auth = useSelector(selectAuthentication);

  useEffect(() => {
    resources
      .getRoomBySlug(params.slug)
      .map(setRoom)
      .flatMapErr(() => resources.getChallengeBySlug(params.slug).map(setChallenge));
  }, []);

  if (auth.authenticationType === 'none') {
    return null;
  }

  if (room) {
    return (
      <GenericRoom
        roomCredentials={{
          id: room.id,
          code: room.code || undefined,
        }}
      />
    );
  } else if (challenge) {
    return (
      <Page>
        <SocketConsumer
          render={() => (
            <Box align="center" justify="center">
              <ChallengeInfo
                challenge={challenge}
                user={auth.user}
                onDeny={() => {
                  history.replace('/');
                }}
                onAccept={() => {
                  resources
                    .acceptChallenge({
                      id: challenge.id,
                      userId: auth.user.id,
                    })
                    .map((room) => {
                      history.push(toRoomUrlPath(room));
                    });
                }}
              />
            </Box>
          )}
        />
      </Page>
    );
  }

  return <AwesomeLoaderPage />;
};
