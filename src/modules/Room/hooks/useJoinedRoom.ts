import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toDictIndexedBy } from 'src/lib/util';
import { getPlayerStats } from 'src/modules/Games/Chess/lib';
import { Room, selectRoom } from 'src/providers/PeerProvider';
import { selectCurrentRoomActivity } from '../Activities/redux/selectors';
import { BaseRoomActivity } from '../Activities/redux/types';
import { toRoomActivity } from '../Activities/util';
import { toRoomMember } from '../Room/util';
import { JoinedRoom, RoomMembers } from '../types';

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

  useEffect(() => {
    const nextJoinedRoom = mergeSlicesIntoJoinedRoom({ room, currentRoomActivity: roomActivity });
    setJoinedRoom(nextJoinedRoom);

    console.log('nextJoinedRoom', nextJoinedRoom);
  }, [room, roomActivity]);

  return joinedRoom;
};
