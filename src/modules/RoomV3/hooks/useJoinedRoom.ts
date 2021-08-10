import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toDictIndexedBy } from 'src/lib/util';
// import { toRoomMember } from 'src/modules/Room/Room/util';
import { Room, selectRoom } from 'src/providers/PeerProvider';
import { console } from 'window-or-global';
import { selectCurrentRoomActivity } from '../RoomActivity/redux/selectors';
import { BaseRoomActivity } from '../RoomActivity/redux/types';
import { toRoomActivity } from '../RoomActivity/util/util';
import { JoinedRoom } from '../types';
import { toRoomMember } from '../util';

// This doesn't check for data integrity other then all being present, simply merges them
const mergeSlicesIntoJoinedRoom = (slices: {
  room?: Room;
  currentRoomActivity?: BaseRoomActivity;
}): JoinedRoom | undefined => {
  console.log('[mergeSlicesIntoJoinedRoom] slices', slices);

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

  useEffect(() => {
    const nextJoinedRoom = mergeSlicesIntoJoinedRoom({ room, currentRoomActivity: roomActivity });
    setJoinedRoom(nextJoinedRoom);

    console.group();
    console.log('nextJoinedRoom', nextJoinedRoom);
    console.groupEnd();

    console.group(
      `%cJoinedRoom %cUpdated:`,
      'color: grey;',
      'color: #4CAF50; font-weight: bold;',
    );
    console.log('Prev:', joinedRoom);
    console.log('Next:', nextJoinedRoom);
    console.groupEnd();

  }, [room, roomActivity]);

  return joinedRoom;
};
