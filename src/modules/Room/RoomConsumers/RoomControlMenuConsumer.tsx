import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { createUseStyles } from 'src/lib/jss';
import { DropdownMenu } from 'src/components/DropdownMenu';
import { ClipboardCopyWidget } from 'src/components/ClipboardCopy';
import { useRoomConsumer } from './useRoomConsumer';
import { toRoomUrlPath } from 'src/lib/util';
import { useExitRoom } from '../hooks/useExitRoom';

type Props = {};

export const RoomControlMenuConsumer: React.FC<Props> = () => {
  const cls = useStyles();
  const roomConsumer = useRoomConsumer();
  const exitRoom = useExitRoom();

  if (!roomConsumer?.room) {
    return null;
  }

  return (
    <ClipboardCopyWidget
      value={`${window.location.origin}/${toRoomUrlPath(roomConsumer.room)}`}
      render={({ copied, copy }) => (
        <DropdownMenu
          title={<FontAwesomeIcon icon={faBars} />}
          items={[
            {
              title: copied ? 'Link Copied' : 'Invite Friends',
              onClick: copy,
            },
            {
              title: 'Exit Room',
              onClick: () => exitRoom({ exitBy: 'goBack' }),
            },
          ]}
          droplistSide="left"
          droplistClassName={cls.droplist}
        />
      )}
    />
  );
};

const useStyles = createUseStyles({
  droplist: {
    width: '120px',
  },
});
