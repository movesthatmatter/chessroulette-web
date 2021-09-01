import React, { useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { GenericLayoutDesktopRoomConsumer } from 'src/modules/Room/RoomConsumers/GenericLayoutDesktopRoomConsumer';
import { PeerConsumer, usePeerState } from 'src/providers/PeerProvider';
import { RoomLichessActivity } from '../PlayActivity';
import { LichessGameContainer } from 'src/modules/LichessPlay/PlayLichess/LichessGameContainer';
import { useLichessProvider } from 'src/modules/LichessPlay/LichessAPI/useLichessProvider';
import { AwesomeErrorPage } from 'src/components/AwesomeError';
import { AwesomeLoader } from 'src/components/AwesomeLoader';
import { Events } from 'src/services/Analytics';

type Props = {
  activity: RoomLichessActivity;
};

export const LichessActivity: React.FC<Props> = (props) => {
  const cls = useStyles();
  const peerState = usePeerState();
  const lichess = useLichessProvider();

  useEffect(() => {
    if (lichess){
      // This is needed to have a stream open on this page as well in case user refreshes the page - it will get back to the event flow
      lichess.startStream();
    }
  }, []);

  if (peerState.status !== 'open') {
    return null;
  }

  return (
    <PeerConsumer
      renderFallback={(r) => {
        if (r.state === 'error') {
          return <AwesomeErrorPage />;
        }

        return <AwesomeLoader />;
      }}
      renderRoomJoined={({room, request}) => (
        <GenericLayoutDesktopRoomConsumer
          renderActivity={({ boardSize }) => 
            <LichessGameContainer 
              boardSize={boardSize} 
              onSendNewChatMessage={(payload) => {
                request({
                  kind: 'broadcastChatMessage',
                  content: payload
                })

                Events.trackChatMessageSent();
              }}  
            />}
        />
      )}
   />
  );
};

const useStyles = createUseStyles({
  container: {},
});
