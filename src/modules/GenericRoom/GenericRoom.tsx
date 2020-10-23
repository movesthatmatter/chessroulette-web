import React from 'react';
import { PeerConsumer } from 'src/components/PeerProvider';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { gameActions } from 'src/modules/Games/Chess/gameActions';
import { GameRoomV2 } from '../GameRoomV2/GameRoomV2';
import { RoomWithPlayActivity } from 'src/components/RoomProvider';
import { FaceTimeSetupWidget } from 'src/components/FaceTimeArea/FaceTimeSetupWidget';
import { RoomCredentials } from 'src/components/PeerProvider/util';

type Props = {
  roomCredentials: RoomCredentials;
};

export const GenericRoom: React.FC<Props> = (props) => {
  return (
    <PeerConsumer
      renderRoomJoined={(p) => {
        if (p.room.activity.type === 'play') {
          return (
            <FaceTimeSetupWidget
              renderPermissionGranted={() => (
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
              )}
            />
          );
        }

        return null;
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
          p.joinRoom(props.roomCredentials);
        }
      }}
      // TODO: Add an onClose callback to leave the room as well. MAYBE!
      // Normally when closing the socket connection the room is updated!
      onUnmounted={(p) => {
        if (p.state === 'joined') {
          p.leaveRoom();
        }
      }}
    />
  );
};
