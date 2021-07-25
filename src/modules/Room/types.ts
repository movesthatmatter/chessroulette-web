import { Room } from 'src/providers/PeerProvider';
import { RoomActivity } from './Activities/redux/types';

// This is a type that sticks together - the activity here is tied to this room
//  it gets created in redux most likely
export type JoinedRoom = Room & {
  // it could have passed activities
  currentActivity: RoomActivity;

  // Could be assigned to the craetor or if he leaves to someone else!
  // host
};
