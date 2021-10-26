import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ChessGameHistoryProvider,
  ChessGameHistoryProviderProps,
} from 'src/modules/Games/Chess/components/GameHistory';
import { GenericLayoutDesktopRoomConsumer } from 'src/modules/Room/RoomConsumers/GenericLayoutDesktopRoomConsumer';
import { usePeerState } from 'src/providers/PeerProvider';
import { SocketClient } from 'src/services/socket/SocketClient';
import { console } from 'window-or-global';
import { AnalysisActivity, AnalysisActivityProps } from './AnalysisActivity';
import { RoomAnalysisActivity } from './types';

type Props = Pick<AnalysisActivityProps, 'deviceSize'> & {
  activity: RoomAnalysisActivity;
};

export const AnalysisActivityContainer: React.FC<Props> = (props) => {
  const peerState = usePeerState();

  // These are the analysis actions!
  const actions = useMemo(() => {
    const request: SocketClient['send'] = (payload) => {
      // TODO: Look into what to do if not open!
      // THE ui should actually change and not allow interactions, but ideally
      //  the room still shows!
      // TODO: That should actually be somewhere global maybe!
      if (peerState.status === 'open') {
        peerState.client.send(payload);
      }
    };

    const onImportGame: AnalysisActivityProps['onImportedGame'] = (game) => {
      request({
        kind: 'analysisImportGameRequest',
        content: {
          id: props.activity.analysisId,
          gameId: game.id,
        },
      });
    };

    const onImportPgn: AnalysisActivityProps['onImportedPgn'] = (pgn) => {
      request({
        kind: 'analysisImportPgnRequest',
        content: {
          id: props.activity.analysisId,
          pgn,
        },
      });
    };

    const onRefocused: NonNullable<ChessGameHistoryProviderProps['onRefocused']> = (nextIndex) => {
      request({
        kind: 'analysisRefocusRequest',
        content: {
          id: props.activity.analysisId,
          focusIndex: nextIndex,
        },
      });
    };

    const onMoved: NonNullable<ChessGameHistoryProviderProps['onMoved']> = (move, atIndex) => {
      request({
        kind: 'analysisMoveRequest',
        content: {
          id: props.activity.analysisId,
          move,
          atIndex,
        },
      });
    };

    return {
      onImportGame,
      onImportPgn,
      onRefocused,
      onMoved,
    };
  }, [props.activity.analysisId, peerState.status]);

  const renderActivity = useCallback(
    ({ boardSize, leftSide }) => (
      <ChessGameHistoryProvider
        key={props.activity.analysisId}
        onMoved={actions.onMoved}
        onRefocused={actions.onRefocused}
        history={props.activity.analysis?.history || []}
        displayedIndex={props.activity.analysis?.focusIndex}
      >
        {props.activity.analysis && (
          <AnalysisActivity
            boardSize={boardSize}
            leftSide={leftSide}
            deviceSize={props.deviceSize}
            participants={props.activity.participants}
            analysis={props.activity.analysis}
            onImportedPgn={actions.onImportPgn}
            onImportedGame={actions.onImportGame}
          />
        )}
      </ChessGameHistoryProvider>
    ),
    [props.activity, actions]
  );

  return <GenericLayoutDesktopRoomConsumer renderActivity={renderActivity} />;
};

const MyTestComponent: React.FC = () => {
  return <>works</>;
};

MyTestComponent.whyDidYouRender = true;
