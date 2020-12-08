import React from 'react';
import { PeerConsumer } from 'src/components/PeerProvider';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { gameActions } from 'src/modules/Games/Chess/gameActions';
import { GameRoomV2 } from '../GameRoomV2/GameRoomV2';
import { RoomWithPlayActivity } from 'src/components/RoomProvider';
import { FaceTimeSetupWidget } from 'src/components/FaceTimeArea/FaceTimeSetupWidget';
import { RoomCredentials } from 'src/components/PeerProvider/util';
import { Box } from 'grommet';
import { Events } from 'src/services/Analytics';

type Props = {
  roomCredentials: RoomCredentials;
};

export const GenericRoom: React.FC<Props> = (props) => {
  return (
    <Box background="#F6F8FB" fill>
      <PeerConsumer
        renderRoomJoined={(p) => {
          if (p.room.activity.type === 'play') {
            return (
              <FaceTimeSetupWidget
                renderPermissionGranted={() => (
                  <GameRoomV2
                    key={p.room.id}
                    room={p.room as RoomWithPlayActivity}
                    onMove={(nextMove, _, history, color) => {
                      p.request(gameActions.move(nextMove));

                      // Track Game Started for both Colors
                      if (
                        (color === 'white' && history.length === 1) ||
                        (color === 'black' && history.length === 2)
                      ) {
                        Events.trackGameStarted(color);
                      }
                    }}
                    onOfferDraw={() => {
                      p.request(gameActions.offerDraw());

                      Events.trackDrawOffered();
                    }}
                    onDrawAccepted={() => {
                      p.request(gameActions.acceptDraw());

                      Events.trackDrawAccepted();
                    }}
                    onDrawDenied={() => {
                      p.request(gameActions.denyDraw());

                      Events.trackDrawDenied();
                    }}
                    onResign={() => {
                      p.request(gameActions.resign());

                      Events.trackResigned();
                    }}
                    onAbort={() => {
                      p.request(gameActions.abort());

                      Events.trackAborted();
                    }}
                    onRematchOffer={() => {
                      p.request(gameActions.offerRematch());

                      Events.trackRematchOffered();
                    }}
                    onRematchAccepted={() => {
                      p.request(gameActions.acceptRematch());

                      Events.trackRematchAccepted();
                    }}
                    onRematchDenied={() => {
                      p.request(gameActions.denyRematch());

                      Events.trackRematchDenied();
                    }}
                    onOfferCanceled={() => p.request(gameActions.cancelOffer())}
                    onTimerFinished={() => p.request(gameActions.statusCheck())}
                    onStatusCheck={() => p.request(gameActions.statusCheck())}
                  />
                )}
              />
            );
          }

          return null;
        }}
        renderRoomNotJoined={() => <AwesomeLoaderPage />}
        renderFallback={() => <AwesomeLoaderPage />}
      />
    </Box>
  );
};
