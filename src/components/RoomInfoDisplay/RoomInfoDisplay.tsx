import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColoredButton } from 'src/components/ColoredButton/ColoredButton';
import { RoomStatsRecord, PeerRecord } from 'dstnd-io';
import { noop } from 'src/lib/util';
import { RoomListPeer } from './RoomListPeer/RoomListPeer';

export type RoomInfoProps = {
  me: PeerRecord;
  room: RoomStatsRecord;
  onLeaveRoom?: (roomId?: string) => void;
  onInviteNewPeer?: () => void;
  onChallenge?: (peerId: string) => void;
};

export const RoomInfoDisplay = ({
  me,
  room,
  onLeaveRoom = noop,
  onInviteNewPeer = noop,
  onChallenge = noop,
}: RoomInfoProps) => {
  const cls = useStyle();
  return (
    <div className={cls.roomInfoContainer}>
      <div className={cls.headerContainer}>
        <div className={cls.roomTitleContainer}>{room.name}</div>
        <div className={cls.addPeerContainer}>
          <FontAwesomeIcon icon={faUserPlus} size="lg" />
        </div>
      </div>
      <div className={cls.listContainer}>
        <RoomListPeer
          // TODO: I think the logic for me needs to change a bit
          //  If there is no game, it will always show in the left side at the bottom (home)
          //  If there is game going and "me" is not a player, than it will be moved here, into
          //   the spectators area, but without the ability to challenge. Maybe when it's here
          //   it should also display a bit different then the rest to know it/s you.
          //   Maybe always 1st or bigger or smaller or smtg :)
          peer={me}
          onPeerChallenge={() => onChallenge?.(me.id)}
        />
        {Object.values(room.peers).map((peer) => (
          <div>
            <RoomListPeer
              peer={peer}
              onPeerChallenge={() => onChallenge(peer.id)}
            />
          </div>
        ))}
      </div>
      <div className={cls.buttonContainer}>
        <ColoredButton
          label="Leave Room"
          color="#E66162"
          fontSize="18px"
          padding="4px"
          onClickFunction={onLeaveRoom}
        />
      </div>
    </div>
  );
};

const useStyle = createUseStyles({
  roomInfoContainer: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Roboto',
    fontSize: '18px',
    color: '#322F2F',
    fontWeight: 'normal',
    width: '244px',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '2px solid #6792B4',
    marginBottom: '10px',
  },
  roomTitleContainer: {
    padding: '5px',
  },
  addPeerContainer: {
    borderRadius: '8px',
    padding: '8px',
    '&:hover': {
      boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.19)',
      cursor: 'pointer',
    },
  },
  listContainer: {},
  buttonContainer: {
    marginTop: '20px',
  },
});
