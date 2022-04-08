import { RoomActivityCreationRecord } from 'chessroulette-io';
import { createContext } from 'react';
import { BoardOrientation } from 'src/modules/Games';
import { DeviceSize } from 'src/theme/hooks/useDeviceSize';
import { JoinedRoom } from '../../types';

export type RoomOptions = {
  showActions?: boolean;
};

export type JoinedRoomProviderContextState =
  | undefined
  | {
      deviceSize: DeviceSize;
      room: JoinedRoom;
      roomActions: {
        switchActivity: (p: RoomActivityCreationRecord) => void;
        goLive: () => void; // TODO: Add ability to stop Live
        toggleInMeetup: (state: boolean) => void;
      };

      // Edit: This was added b/c of the tournaments but this should be part of configuring a room!
      roomOptions: RoomOptions;

      // This could be part of a BoardSettings when we have more than one configurable setting
      boardOrientation: BoardOrientation;
      setBoardOrientation: (
        nextOrFn: BoardOrientation | ((prev: BoardOrientation) => BoardOrientation)
      ) => void;
    };

export const JoinedRoomProviderContext = createContext<JoinedRoomProviderContextState>(undefined);
