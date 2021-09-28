import { useContext } from 'react';
import { RoomProviderContext } from '../RoomProvider';

export const useRoomConsumer = () => useContext(RoomProviderContext);
