import { useContext } from 'react';
import { JoinedRoomProviderContext } from '../Providers/JoinedRoomProvider';

export const useRoomConsumer = () => useContext(JoinedRoomProviderContext);
