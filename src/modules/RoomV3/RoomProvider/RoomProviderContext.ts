import { createContext } from 'react';
import { JoinedRoom } from 'src/modules/Room/types';
import { DeviceSize } from 'src/theme/hooks/useDeviceSize';

export type RoomProviderContextState = undefined | {
  room: JoinedRoom;
  deviceSize: DeviceSize;
};

export const RoomProviderContext = createContext<RoomProviderContextState>(undefined);
