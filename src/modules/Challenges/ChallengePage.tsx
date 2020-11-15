import { ChallengeRecord, RoomRecord } from 'dstnd-io';
import { Box } from 'grommet';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { Page } from 'src/components/Page';
import { toRoomUrlPath } from 'src/lib/util';
import { resources } from 'src/resources';
import { ChallengeInfo } from './ChallengeInfo';
import { GenericRoom } from 'src/modules/GenericRoom';
import { selectMyPeer } from 'src/components/PeerProvider';

type Props = {};

export const ChallengePage: React.FC<Props> = () => {
  const params = useParams<{ slug: string }>();
  const [challenge, setChallenge] = useState<ChallengeRecord>();
  const [room, setRoom] = useState<RoomRecord>();

  const history = useHistory();
  const myPeer = useSelector(selectMyPeer);

  useEffect(() => {
    resources
      .getRoomBySlug(params.slug)
      .map(setRoom)
      .flatMapErr(() => resources.getChallengeBySlug(params.slug).map(setChallenge));
  }, []);

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
                    history.push(toRoomUrlPath(room));
                  });
              }}
            />
          )}
        </Box>
      </Page>
    );
  }

  return <AwesomeLoaderPage />;
};
