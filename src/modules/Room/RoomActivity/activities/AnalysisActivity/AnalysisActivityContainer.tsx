import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ChessGameHistoryProvider } from 'src/modules/Games/Chess/components/GameHistory';
import { GenericLayoutDesktopRoomConsumer } from 'src/modules/Room/RoomConsumers/GenericLayoutDesktopRoomConsumer';
import { usePeerState } from 'src/providers/PeerProvider';
import { SocketClient } from 'src/services/socket/SocketClient';
import { updateCurrentAnalysisAction } from '../../redux/actions';
import { AnalysisActivity, AnalysisActivityProps } from './AnalysisActivity';
import { RoomAnalysisActivity } from './types';

type Props = Pick<AnalysisActivityProps, 'deviceSize'> & {
  activity: RoomAnalysisActivity;
};

export const AnalysisActivityContainer: React.FC<Props> = (props) => {
  const peerState = usePeerState();
  const dispatch = useDispatch();

  console.log('AnalysisActivityContainer workd', props.activity);

  // Subscribe to Analysis Updates
  useEffect(() => {
    if (peerState.status === 'open') {
      const unsubscribers = [
        peerState.client.onMessage((payload) => {
          if (payload.kind === 'analysisUpdatedResponse') {
            dispatch(updateCurrentAnalysisAction(payload.content));
          }
        }),
      ];

      return () => {
        unsubscribers.forEach((unsubscribe) => unsubscribe());
      };
    }
  }, [peerState.status]);

  // if (!props.activity.analysis) {
  //   // Add (Goey) loader or pass in fallabck component
  //   return null;
  // }

  const request: SocketClient['send'] = (payload) => {
    // TODO: Look into what to do if not open!
    // THE ui should actually change and not allow interactions, but ideally
    //  the room still shows!
    // TODO: That should actually be somewhere global maybe!
    if (peerState.status === 'open') {
      peerState.client.sendMessage(payload);
    }
  };

  return (
    <GenericLayoutDesktopRoomConsumer
      renderActivity={({ boardSize }) => (
        <ChessGameHistoryProvider
          onMoved={(move, atIndex) => {
            request({
              kind: 'analysisMoveRequest',
              content: {
                id: props.activity.analysisId,
                move,
                atIndex,
              },
            });
          }}
          onRefocused={(nextIndex) => {
            request({
              kind: 'analysisRefocusRequest',
              content: {
                id: props.activity.analysisId,
                focusIndex: nextIndex,
              },
            });
          }}
          history={props.activity.analysis?.history || []}
          displayedIndex={props.activity.analysis?.focusIndex}
        >
          {props.activity.analysis && (
            <AnalysisActivity
              boardSize={boardSize}
              deviceSize={props.deviceSize}
              analysis={props.activity.analysis}
            />
          )}
        </ChessGameHistoryProvider>
      )}
    />
  );
};
