import React from 'react';
import { PeerConsumer } from 'src/components/PeerProvider';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { selectAuthentication } from 'src/services/Authentication';
import { useSelector } from 'react-redux';
import { gameActions } from 'src/modules/Games/Chess/gameActions';
import { GameRoomV2 } from '../GameRoomV2/GameRoomV2';
import { RoomWithPlayActivity } from 'src/components/RoomProvider';

type Props = {};

export const GenericRoom: React.FC<Props> = () => {
  const authentication = useSelector(selectAuthentication);

  // This should never actually occur!
  if (authentication.authenticationType === 'none') {
    return null;
  }

  return (
    <PeerConsumer
      renderRoomJoined={(p) => {
        if (p.room.activity.type === 'play') {
          return (
            <GameRoomV2
              room={p.room as RoomWithPlayActivity}
              onMove={(nextMove) => p.request(gameActions.move(nextMove))}
              onOfferDraw={() => p.request(gameActions.offerDraw())}
              onDrawAccepted={() => p.request(gameActions.acceptDraw())}
              onDrawDenied={() => p.request(gameActions.denyDraw())}
              onResign={() => p.request(gameActions.resign())}
              onAbort={() => p.request(gameActions.abort())}
              onRematchOffer={() => p.request(gameActions.offerRematch())}
              onRematchAccepted={() => p.request(gameActions.acceptRematch())}
              onRematchDenied={() => p.request(gameActions.denyRematch())}
            />
          );
        }

        return;
      }}
      renderRoomNotJoined={() => <AwesomeLoaderPage />}
      renderFallback={() => <AwesomeLoaderPage />}
      onUpdate={(p) => {
        if (p.state === 'joined') {
          p.startLocalStream();
        }
      }}
      onReady={(p) => {
        // Join the Room right away if already part of the game!
        if (p.state === 'notJoined') {
          p.joinRoom();
        }
      }}
    />
  );
};
