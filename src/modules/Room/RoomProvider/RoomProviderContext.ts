import { RoomActivityCreationRecord } from 'dstnd-io';
import { createContext } from 'react';
import { BoardOrientation } from 'src/modules/Games';
import { DeviceSize } from 'src/theme/hooks/useDeviceSize';
import { JoinedRoom } from '../types';

export type RoomProviderContextState = undefined | {
  deviceSize: DeviceSize;
  room: JoinedRoom;
  roomActions: {
    switchActivity: (p: RoomActivityCreationRecord) => void;
    goLive: () => void;
  },

  // This could be part of a BoardSettings when we have more than one configurable setting
  boardOrientation: BoardOrientation;
  setBoardOrientation: (nextOrFn: BoardOrientation | ((prev: BoardOrientation) => BoardOrientation)) => void;
};

export const RoomProviderContext = createContext<RoomProviderContextState>(undefined);
