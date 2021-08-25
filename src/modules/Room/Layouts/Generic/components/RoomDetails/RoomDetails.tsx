import React from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
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
      <Text size="small2">Room:</Text>
      <Text size="small1">{` ${room.name}  `}</Text>
      <br />
      <Text size="small2">Active Members:</Text>
      <Text size="small1">{` ${Object.keys(room.peersIncludingMe).length}`}</Text>

      <br />
      {Object.keys(room.pendingChallenges).length > 0 && (
        <>
          has challenge
        </>
      )}
    </div>
  </div>
);
