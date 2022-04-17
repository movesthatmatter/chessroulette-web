import { useState } from 'react';
import { useSelector } from 'react-redux';
import config from 'src/config';
import { isDeepEqual, toDictIndexedBy } from 'src/lib/util';
import { selectCurrentRoomActivity } from '../RoomActivity/redux/selectors';
import { BaseRoomActivity } from '../RoomActivity/redux/types';
import { toRoomActivity } from '../RoomActivity/util/util';
import { JoinedRoom, Room } from '../types';
import { toRoomMember } from '../util';
import { diff, detailedDiff } from 'deep-object-diff';
import { useCustomCompareEffect } from 'src/lib/hooks/useCustomCompareEffect';
import { hasRoomActivityChanged } from './util/joinedRoomComparators';
import { selectRoom } from '../redux/selectors';

// This doesn't check for data integrity other then all being present, simply merges them
const mergeSlicesIntoJoinedRoom = (slices: {
  room?: Room;
  currentRoomActivity?: BaseRoomActivity;
}): JoinedRoom | undefined => {
  if (!slices.room) {
    return undefined;
  }

  if (!slices.currentRoomActivity) {
    return undefined;
  }

  const peersList = Object.values(slices.room.peersIncludingMe);
  const membersList = peersList.map(toRoomMember);
  const members = toDictIndexedBy(membersList, (m) => m.peer.user.id);

  return {
    ...slices.room,
    members,
    currentActivity: toRoomActivity(slices.currentRoomActivity, membersList),
  };
};

// TODO: This is just temporary since there is no easy way to integrate them at redux level for now!
//  But it should change. In the future it should just wrap the joined room selector
export const useJoinedRoom = () => {
  const room = useSelector(selectRoom);
  const roomActivity = useSelector(selectCurrentRoomActivity);
  const [joinedRoom, setJoinedRoom] = useState(
    mergeSlicesIntoJoinedRoom({
      room,
      currentRoomActivity: roomActivity,
    })
  );


  useCustomCompareEffect(
    () => {
      // Ensure the updates are actual updates
      const nextJoinedRoom = mergeSlicesIntoJoinedRoom({
        room,
        currentRoomActivity: roomActivity,
      });
      setJoinedRoom(nextJoinedRoom);

      // Logging
      if (config.DEBUG) {
        console.group(
          `%cJoinedRoom %cUpdated:`,
          'color: grey;',
          'color: #4CAF50; font-weight: bold;'
        );
        console.log('Prev:', joinedRoom);
        console.log('Next:', nextJoinedRoom);
        console.log('Diff:', diff(joinedRoom || {}, nextJoinedRoom || {}));
        console.log('Detailed Diff:', detailedDiff(joinedRoom || {}, nextJoinedRoom || {}));
        console.groupEnd();
      }
    },
    [room, roomActivity],
    ([currentRoom, currentRoomActivity], [prevRoom, prevRoomActivity]) =>
      isDeepEqual(currentRoom, prevRoom) &&
      !hasRoomActivityChanged(
        currentRoomActivity as BaseRoomActivity,
        prevRoomActivity as BaseRoomActivity
      )
  );

  return joinedRoom;
};
