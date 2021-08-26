import React, { useContext, useEffect } from 'react';
import { NoActivity } from '../RoomActivity/activities/NoActivity';
import { PlayActivity } from '../RoomActivity/activities/PlayActivity';
import { AnalysisActivity } from '../RoomActivity/activities/AnalysisActivity';
import { RoomProviderContext } from '../RoomProvider';
import { usePeerState } from 'src/providers/PeerProvider';
import { useDispatch } from 'react-redux';
import { updateCurrentAnalysisAction, updateJoinedGameAction } from '../RoomActivity/redux/actions';
import { useGameActions } from 'src/modules/Games/GameActions';

type Props = {};

export const ActivityRoomConsumer: React.FC<Props> = () => {
  const context = useContext(RoomProviderContext);
  const peerState = usePeerState();
  const gameActions = useGameActions();
  const dispatch = useDispatch();

  useEffect(() => {
    if (peerState.status === 'open') {
      const unsubscribers = [
        // Analysis Activity Listener
        peerState.client.onMessage((payload) => {
          // These are the room activity messages
          // TODO: They could be unified into something like: roomActivityUpdated
          if (payload.kind === 'analysisUpdatedResponse') {
            dispatch(updateCurrentAnalysisAction(payload.content));
          }
        }),
        // Play Activity listener
        gameActions.onGameUpdatedEventListener((nextGame) => {
          dispatch(updateJoinedGameAction(nextGame));
        }),
      ];

      return () => {
        unsubscribers.forEach((unsubscribe) => unsubscribe());
      };
    }
  }, [peerState.status]);

  if (!context) {
    // Loader
    return null;
  }

  const { currentActivity } = context.room;

  if (currentActivity.type === 'play') {
    return <PlayActivity activity={currentActivity} deviceSize={context.deviceSize} />;
  }

  if (currentActivity.type === 'analysis') {
    return <AnalysisActivity activity={currentActivity} deviceSize={context.deviceSize} />;
  }

  return <NoActivity deviceSize={context.deviceSize} />;
};
