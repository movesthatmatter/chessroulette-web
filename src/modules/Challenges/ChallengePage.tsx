import { ChallengeRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { Button } from 'src/components/Button';
import { Page } from 'src/components/Page';
import { SocketConsumer } from 'src/components/SocketProvider';
import { createUseStyles } from 'src/lib/jss';
import { toRoomUrlPath } from 'src/lib/util';
import { resources } from 'src/resources';
import { selectAuthentication } from 'src/services/Authentication';

type Props = {};

export const ChallengePage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const params = useParams<{ slug: string }>();
  const [challenge, setChallenge] = useState<ChallengeRecord | undefined>();

  const history = useHistory();
  const auth = useSelector(selectAuthentication);

  useEffect(() => {
    resources
      .getChallengeBySlug(params.slug)
      .map(setChallenge);
  }, []);

  if (auth.authenticationType === 'none') {
    return null;
  }

  if (!challenge) {
    return <AwesomeLoaderPage />
  }

  return (
    <Page>
      <SocketConsumer
        onReady={(socket) => {
          socket.send({
            kind: 'userIdentification',
            content: {
              userId: auth.user.id,
            }
          });
        }}
        render={() => (
          <>
            {challenge.createdBy} challengeed you to a {challenge.gameSpecs.timeLimit} game!
            <Button 
              label="Accept Challenge"
              onClick={() => {
                resources.acceptChallenge({
                  id: challenge.id,
                  userId: auth.user.id,
                })
                .map((room) => {
                  console.log('challenge accepted', room);
                  history.push(toRoomUrlPath(room));
                })
                .mapErr((e) => {
                  console.log('challenge accept error', e);
                })
              }}
            />
          </>
        )}
      />
    </Page>
  );
};

const useStyles = createUseStyles({
  container: {},
});