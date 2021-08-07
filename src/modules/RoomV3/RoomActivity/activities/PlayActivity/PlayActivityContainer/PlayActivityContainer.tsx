import React, { useEffect } from 'react';
import { usePeerState } from 'src/providers/PeerProvider';
import { useGameActions } from 'src/modules/Games/GameActions';
import { PlayActivity } from '../PlayActivity';
import { useDispatch } from 'react-redux';
import { updateJoinedGameAction } from '../../../redux/actions';
import { GameStateDialogProvider } from 'src/modules/Games/components/GameStateDialog';
import { PlayActivityProps } from '../PlayActivity/PlayActivity';
import { RoomPlayActivity } from 'src/modules/Room/Activities/PlayActivity';

type Props = Omit<PlayActivityProps, 'activity'> & {
  activity: RoomPlayActivity;
};

export const PlayActivityContainer: React.FC<Props> = ({ activity, ...props }) => {
  const dispatch = useDispatch();
  const peerState = usePeerState();
  const gameActions = useGameActions();


  // TODO: This should be in the RoomActivity not here as the room activity redux gets updated!
  useEffect(() => {
    if (peerState.status === 'open') {
      // Automatically Join the game for now!
      // In the future this might be differed to the User or other actions
      //  depending on the requirements
      // TODO: Also, the game could not be considered ready to start until
      //  it's joined by both players or something alike!
      // This could also help with the idea of creating new games from inside the room
      //  between different peers than the ones that created & accepted the challenge
      // request(gameActions.join());
      gameActions.onJoin();

      const unsubscribers = [
        gameActions.onGameUpdatedEventListener((nextGame) => {
          dispatch(updateJoinedGameAction(nextGame));
        }),
      ];

      return () => {
        unsubscribers.forEach((cb) => cb());
      };
    }
  }, [peerState.status]);

  if (!activity.game) {
    // Add (Goey) loader or pass in fallabck component
    return null;
  }

  return (
    <GameStateDialogProvider
      dialogNotificationTypes={props.deviceSize.isMobile ? 'all' : 'not-during-started-game'}
      activity={activity}
    >
      <PlayActivity activity={activity} {...props} />
    </GameStateDialogProvider>
  );
};
