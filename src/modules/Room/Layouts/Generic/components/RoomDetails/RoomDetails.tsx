import React from 'react';
import { Text } from 'src/components/Text';
import { getUserDisplayName } from 'src/modules/User';
import { Room } from 'src/providers/PeerProvider';

type Props = {
  room: Room;
};

export const RoomDetails: React.FC<Props> = ({ room }) => (
  <div>
    <div
      style={{
        lineHeight: 0,
      }}
    >
      <Text size="small2">{getUserDisplayName(room.createdByUser)}'s Room</Text>
      <br />
      <Text size="small2">Active Members:</Text>
      <Text size="small1">{` ${Object.keys(room.peersIncludingMe).length}`}</Text>
    </div>
  </div>
);
