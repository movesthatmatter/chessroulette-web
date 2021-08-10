import { createContext } from 'react';
import { DeviceSize } from 'src/theme/hooks/useDeviceSize';
import { JoinedRoom } from '../types';

export type RoomProviderContextState = undefined | {
  room: JoinedRoom;
  deviceSize: DeviceSize;
};

export const RoomProviderContext = createContext<RoomProviderContextState>(undefined);
