import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { createUseStyles } from 'src/lib/jss';
import { DropdownMenu } from 'src/components/DropdownMenu';
import { ExitRoomWidget } from '../widgets/ExitRoomWidget';
import { ClipboardCopyWidget } from 'src/components/ClipboardCopy';
import { useRoomConsumer } from './useRoomConsumer';
import { toRoomUrlPath } from 'src/lib/util';

type Props = {};

export const RoomControlMenuConsumer: React.FC<Props> = (props) => {
  const cls = useStyles();
  const roomConsumer = useRoomConsumer();

  if (!roomConsumer?.room) {
    return null;
  }

  return (
    <ClipboardCopyWidget
      value={`${window.location.origin}${toRoomUrlPath(roomConsumer.room)}`}
      render={({ copied, copy }) => (
        <ExitRoomWidget
          render={({ leave }) => (
            <DropdownMenu
              title={<FontAwesomeIcon icon={faBars} />}
              items={[
                {
                  title: copied ? 'Link Copied' : 'Invite Friends',
                  onClick: copy,
                },
                {
                  title: 'Exit Room',
                  onClick: leave,
                },
              ]}
              droplistSide="left"
              droplistClassName={cls.droplist}
            />
          )}
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
