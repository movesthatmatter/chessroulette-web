import React from 'react';
import { Text } from 'src/components/Text';
import { getUserDisplayName } from 'src/modules/User';
import { Room } from 'src/providers/PeerProvider';

type Props = {
  room: Room;
};

export const RoomDetails: React.FC<Props> = React.memo(({ room }) => {
  if (room.type === 'classroom') {
    const studentIds = Object.keys(room.peersIncludingMe).filter(
      (peerUserId) => peerUserId !== room.createdBy
    );

    return (
      <div>
        <Text size="subtitle2">{room.createdByUser.firstName}'s Classroom</Text>
        <br />
        <Text size="small1">{` ${studentIds.length}`} Students Present</Text>
      </div>
    );
  }

  return (
    <div>
      <Text size="small2">{getUserDisplayName(room.createdByUser)}'s Room</Text>
      <br />
      <Text size="small1">{`${Object.keys(room.peersIncludingMe).length} `}</Text>
      <Text size="small2">Active Members</Text>
    </div>
  );
});
