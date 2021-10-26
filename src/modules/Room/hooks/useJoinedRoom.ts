import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import config from 'src/config';
import { isDeepEqual, toDictIndexedBy } from 'src/lib/util';
import { Room, selectRoom } from 'src/providers/PeerProvider';
import { selectCurrentRoomActivity } from '../RoomActivity/redux/selectors';
import { BaseRoomActivity } from '../RoomActivity/redux/types';
import { toRoomActivity } from '../RoomActivity/util/util';
import { JoinedRoom } from '../types';
import { toRoomMember } from '../util';
import { diff, detailedDiff } from 'deep-object-diff';
import { useCustomCompareEffect } from 'src/lib/hooks/useCustomCompareEffect';
import { hasRoomActivityChanged } from './util/joinedRoomComparators';
import { useStateWithPrev } from 'src/lib/hooks/useStateWithPrev';
import { RoomActivity } from '../RoomActivity/types';
import { console } from 'window-or-global';

type RoomAndActivityZip =
  | {
      room: Room;
      activity: BaseRoomActivity;
    }
  | undefined;

const createJoinedRoom = (roomAndActivityZip: NonNullable<RoomAndActivityZip>): JoinedRoom => {
  const { room, activity } = roomAndActivityZip;

  const peersList = Object.values(room.peersIncludingMe);
  const membersList = peersList.map(toRoomMember);
  const members = toDictIndexedBy(membersList, (m) => m.peer.user.id);

  return {
    ...room,
    members,
    currentActivity: createActivity(room, activity),
  };
};

// This isn't Optimal as it gets recreated each time
// while the premise of redus is to only update the slices that have actually changed
// That means that only touch the actual slices that have changed by value
// and leave the old references in palce so they don't trigger rerenders!
// Also, this is why flattening the data structure works and deep structures don't,
//  because when you update a deep structure the whole object has to update for even the
//  deepest value, but if things are flat (on the same level) then they don't their
// reference doesn't change and so they don't have to update!
const createActivity = (room: Room, activity: BaseRoomActivity) => {
  const peersList = Object.values(room.peersIncludingMe);
  const membersList = peersList.map(toRoomMember);

  return toRoomActivity(activity, membersList);
};

// TODO: This is just temporary since there is no easy way to integrate them at redux level for now!
//  But it should change. In the future it should just wrap the joined room selector
export const useJoinedRoom = () => {
  const room = useSelector(selectRoom);
  const activity = useSelector(selectCurrentRoomActivity);

  // Room & Activity Zip
  const [roomAndActivityZip, setRoomAndActivityZip] = useState<RoomAndActivityZip>(
    room && activity ? { room, activity } : undefined
  );

  // Keep the Room & Activity as together
  useEffect(() => {
    if (room && activity) {
      setRoomAndActivityZip({ room, activity });
    } else {
      setRoomAndActivityZip(undefined);
    }
  }, [room, activity]);

  // Joined Room
  const [joinedRoom, setJoinedRoom] = useState(
    roomAndActivityZip ? createJoinedRoom(roomAndActivityZip) : undefined
  );

  useEffect(() => {
    setJoinedRoom((prev) => {
      if (!roomAndActivityZip) {
        return undefined;
      }

      // If there is no prev, create it for the 1st time
      if (!prev) {
        return createJoinedRoom(roomAndActivityZip);
      }

      // If only the activity has changed, then you can just apply that
      // TODO: Maybe there's a need for a deeper (smarter) comparison
      if (roomAndActivityZip.activity !== prev.currentActivity) {
        return {
          ...prev,
          currentActivity: createActivity(roomAndActivityZip.room, roomAndActivityZip.activity),
        };
      }

      // If the current activity isn't the new one then the room has to be!
      // In case of the room just recreate the whole thing, for now, because
      //   the current activity heavily depends on it
      return createJoinedRoom(roomAndActivityZip);
    });
  }, [roomAndActivityZip]);

  useEffect(() => {
    console.log('[useJoinedRoom] joinedRoom updated', joinedRoom);
  }, [joinedRoom]);

  // useEffect(() => {
  //   setRoomAndActivityWithPrev((prev) => ({
  //     ...prev,
  //     activity,
  //   }))
  // }, [activity]);

  // This waits until both are in
  // useEffect(() => {
  //   setJoinedRoom((prev) => {
  //     // If the room or activity is missing don't do anything
  //     if (!(roomAndActivityWithPrev.current.activity && roomAndActivityWithPrev.current.room)) {
  //       return undefined;
  //     }

  //     // If the activity is the one that changed
  //     if (roomAndActivityWithPrev.current.activity !== roomAndActivityWithPrev.prev.activity) {

  //     }

  //     // If the room is the one that changed
  //     if (roomAndActivityWithPrev.current.room !== roomAndActivityWithPrev.prev.room) {
  //       setJoinedRoom((prev) => {
  //         return prev;
  //       });
  //     }

  //     return prev;
  //   });

  //   // If the room is the one that changed
  //   // if (roomAndActivityWithPrev.current.room !== roomAndActivityWithPrev.prev.room) {
  //   //   setJoinedRoom((prev) => {
  //   //     return prev;
  //   //   });
  //   // }
  // }, [roomAndActivityWithPrev]);

  // Update wen the Room changes
  // useEffect(() => {
  //   setJoinedRoom((prev) => {
  //     if (!room) {
  //       return undefined;
  //     }

  //     if (!prev) {
  //       return undefined;
  //     }

  //     return {
  //       room,
  //       ...prev.
  //     };
  //   });
  // }, [room]);

  // useCustomCompareEffect(
  //   () => {
  //     // Ensure the updates are actual updates
  //     const nextJoinedRoom = mergeSlicesIntoJoinedRoom({
  //       room,
  //       currentRoomActivity: roomActivity,
  //     });
  //     setJoinedRoom(nextJoinedRoom);

  //     // Logging
  //     if (config.DEBUG) {
  //       console.group(
  //         `%cJoinedRoom %cUpdated:`,
  //         'color: grey;',
  //         'color: #4CAF50; font-weight: bold;'
  //       );
  //       console.log('Prev:', joinedRoom);
  //       console.log('Next:', nextJoinedRoom);
  //       console.log('Diff:', diff(joinedRoom || {}, nextJoinedRoom || {}));
  //       console.log('Detailed Diff:', detailedDiff(joinedRoom || {}, nextJoinedRoom || {}));
  //       console.groupEnd();
  //     }
  //   },
  //   [room, roomActivity],
  //   ([currentRoom, currentRoomActivity], [prevRoom, prevRoomActivity]) =>
  //     isDeepEqual(currentRoom, prevRoom) &&
  //     !hasRoomActivityChanged(
  //       currentRoomActivity as BaseRoomActivity,
  //       prevRoomActivity as BaseRoomActivity
  //     )
  // );

  return joinedRoom;
};
