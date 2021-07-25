import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Room, selectRoom } from 'src/providers/PeerProvider';
import { selectCurrentRoomActivity } from '../Activities/redux/selectors';
import { RoomActivity } from '../Activities/redux/types';
import { JoinedRoom } from '../types';

// This doesn't check for data integrity other then all being present, simply merges them
const mergeSlicesIntoJoinedRoom = (slices: {
  room?: Room;
  currentRoomActivity?: RoomActivity;
}): JoinedRoom | undefined => {
  if (!slices.room) {
    return undefined;
  }

  if (!slices.currentRoomActivity) {
    return undefined;
  }

  return {
    ...slices.room,
    currentActivity: slices.currentRoomActivity,
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
    setJoinedRoom(mergeSlicesIntoJoinedRoom({ room, currentRoomActivity: roomActivity }));
  }, [room, roomActivity]);

  return joinedRoom;
};
