import React, { useMemo } from 'react';
import { CreateRoomRequest } from 'dstnd-io';
import { Button, ButtonProps } from 'src/components/Button';
import { useCreateRoom } from './useCreateRoom';
import { useState } from '@storybook/addons';

type Props = Omit<ButtonProps, 'onClick'> & {
  createRoomSpecs: Pick<CreateRoomRequest, 'type' | 'activity'>;
};

export const CreateRoomButtonWidgetFromSpecs: React.FC<Props> = ({
  createRoomSpecs,
  ...buttonProps
}) => {
  // This needs to be memoized since it created a new object each time
  //  otherwise useCreateRoom will run into an infinite loop
  const roomSpecs = useMemo(
    () =>
      ({
        ...createRoomSpecs,
        p2pCommunicationType: 'none', // This Widget can only create Non P2P Rooms
      } as const),
    [createRoomSpecs]
  );

  const createRoomState = useCreateRoom(roomSpecs);

  return (
    <Button
      {...buttonProps}
      disabled={buttonProps.disabled || !createRoomState.isReady}
      onClick={createRoomState.createRoom}
    />
  );
};
