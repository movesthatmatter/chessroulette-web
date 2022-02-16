import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { notificationFactory } from './utils/notificationFactory';
import { useStateWithPrev } from 'src/lib/hooks/useStateWithPrev';
import useDebouncedEffect from 'use-debounced-effect';
import {
  addNotificationAction,
  clearLogAction,
  resolveOfferNotificationAction,
} from '../redux/actions';
import { JoinedRoom } from 'src/modules/Room/types';

// This could depend on the room ID as well
export const useRoomActivityListener = (room: JoinedRoom | undefined) => {
  const dispatch = useDispatch();

  const game = room?.currentActivity.type === 'play' ? room?.currentActivity.game : undefined;
  const warGame = room?.currentActivity.type === 'warGame' ? room.currentActivity.game : undefined;
  const offer = room?.currentActivity.type === 'play' ? room?.currentActivity.offer : undefined;
  const warOffer = room?.currentActivity.type === 'warGame' ? room.currentActivity.offer : undefined;
  const pendingPlayRoomChallenge = (room?.activity.type === 'play' &&  room?.pendingChallenges)
    ? Object.values(room.pendingChallenges)[0]
    : undefined;

    const pendingWarRoomChallenge = (room?.activity.type === 'warGame' &&  room?.pendingChallenges)
    ? Object.values(room.pendingChallenges)[0]
    : undefined;

  const [playStateWithPrev, setPlayStateWithPrev] = useStateWithPrev({ game, offer, pendingPlayRoomChallenge });
  const [warStateWithPrev, setWarStateWithPrev] = useStateWithPrev({ warGame, warOffer, pendingWarRoomChallenge });

  useDebouncedEffect(
    () => {
      // if (game) {
      setPlayStateWithPrev({ game, offer, pendingPlayRoomChallenge });
      // }
    },
    150, // This should be enough time for the game & offer to reconcile
    [game, offer, pendingPlayRoomChallenge]
  );

  useDebouncedEffect(
    () => {
      // if (game) {
      setWarStateWithPrev({ warGame, warOffer, pendingWarRoomChallenge });
      // }
    },
    150, // This should be enough time for the game & offer to reconcile
    [warGame, warOffer, pendingWarRoomChallenge]
  );

  useEffect(() => {
    const nextNotification = notificationFactory(playStateWithPrev);

    if (!nextNotification) {
      return;
    }

    if (nextNotification.type === 'add') {
      dispatch(addNotificationAction({ notification: nextNotification.notification }));
    } else if (nextNotification.type === 'update' && nextNotification.status !== 'pending') {
      dispatch(
        resolveOfferNotificationAction({
          notificationId: nextNotification.id,
          status: nextNotification.status,
        })
      );
    }
  }, [playStateWithPrev]);

  //TODO - add warGame notification too

  useEffect(() => {
    return () => {
      // Clear the Logs when the Listener gets unmounted
      //  This should mean exiting the Room
      dispatch(clearLogAction());
    };
  }, []);
};
