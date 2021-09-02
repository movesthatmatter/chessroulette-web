import React from 'react';
import { ChessGameHistoryProvider } from 'src/modules/Games/Chess/components/GameHistory';
import { GenericLayoutDesktopRoomConsumer } from 'src/modules/Room/RoomConsumers/GenericLayoutDesktopRoomConsumer';
import { usePeerState } from 'src/providers/PeerProvider';
import { SocketClient } from 'src/services/socket/SocketClient';
import { AnalysisActivity, AnalysisActivityProps } from './AnalysisActivity';
import { RoomAnalysisActivity } from './types';

type Props = Pick<AnalysisActivityProps, 'deviceSize'> & {
  activity: RoomAnalysisActivity;
};

export const AnalysisActivityContainer: React.FC<Props> = (props) => {
  const peerState = usePeerState();

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
          key={props.activity.analysisId}
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
