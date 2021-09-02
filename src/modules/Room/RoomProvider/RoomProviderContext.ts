import { RoomActivityType } from 'dstnd-io';
import { createContext } from 'react';
import { DeviceSize } from 'src/theme/hooks/useDeviceSize';
import { JoinedRoom } from '../types';

export type RoomProviderContextState = undefined | {
  deviceSize: DeviceSize;
  room: JoinedRoom;
  roomActions: {
    switchActivity: (p: RoomActivityType) => void;
  }
};

export const RoomProviderContext = createContext<RoomProviderContextState>(undefined);
