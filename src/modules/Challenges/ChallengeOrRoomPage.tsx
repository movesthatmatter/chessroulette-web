import { AsyncResult, ChallengeRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { resources } from 'src/resources';
import { GenericRoom } from 'src/modules/GenericRoom';
import { selectMyPeer, selectPeerProviderState } from 'src/components/PeerProvider';
import { AwesomeErrorPage } from 'src/components/AwesomeError';
import { ChallengePage } from './ChallengePage';
import { useSocketState } from 'src/components/SocketProvider';

type Props = {};

export const ChallengeOrRoomPage: React.FC<Props> = () => {
  const params = useParams<{ slug: string }>();
  const [challenge, setChallenge] = useState<ChallengeRecord>();
  const [resourceState, setResourceState] = useState(
    'none' as 'none' | 'loading' | 'error' | 'success'
  );
  const myPeer = useSelector(selectMyPeer);
  const peerProviderState = useSelector(selectPeerProviderState);
  const socketState = useSocketState();

  useEffect(() => {
    // If there is no room or challenge try to load the challenge
    if (!peerProviderState.room && !challenge && socketState.status === 'open') {
      setResourceState('loading');

      resources
        .getRoomBySlug(params.slug)
        .map((room) => {
          socketState.socket.send({
            kind: 'joinRoomRequest',
            content: {
              roomId: room.id,
              code: room.code || undefined,
            },
          });
        })
        .flatMapErr(() => resources.getChallengeBySlug(params.slug).map(setChallenge))
        .map(
          AsyncResult.passThrough(() => {
            setResourceState('success');
          })
        )
        .mapErr(() => {
          setResourceState('error');
        });
    }
  }, [peerProviderState.room, challenge, socketState.status]);

  if (resourceState === 'loading') {
    return <AwesomeLoaderPage />;
  }

  if (resourceState === 'error') {
    return <AwesomeErrorPage errorType="resourceNotFound" />;
  }

  if (peerProviderState.room) {
    return (
      <GenericRoom
        roomCredentials={{
          id: peerProviderState.room.id,
          code: peerProviderState.room.code || undefined,
        }}
      />
    );
  } else if (challenge) {
    return <ChallengePage challenge={challenge} myPeer={myPeer} />;
  }

  return null;
};
