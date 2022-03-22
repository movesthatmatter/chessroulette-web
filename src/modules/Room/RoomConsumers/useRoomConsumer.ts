import { useContext } from 'react';
import { JoinedRoomProviderContext } from '../JoinedRoomProvider';

export const useRoomConsumer = () => useContext(JoinedRoomProviderContext);
