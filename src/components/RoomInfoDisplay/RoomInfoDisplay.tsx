import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColoredButton } from 'src/components/ColoredButton/ColoredButton';
import { RoomStatsRecord, PeerRecord } from 'dstnd-io';
import { noop } from 'src/lib/util';
import { PopupModal } from 'src/components/PopupModal/PopupModal';
import { AddNewPeerPopUp } from 'src/components/AddNewPeerPopup/AddNewPeerPopup';
import { RoomListPeer, avatarsType } from './RoomListPeer/RoomListPeer';


export type RoomInfoProps = {
  me: PeerRecord;
  room: RoomStatsRecord;
  onLeaveRoom?: (roomId?: string) => void;
  onInviteNewPeer?: () => void;
  onChallenge?: (peerId: string) => void;
};

export const RoomInfoDisplay: React.FC<RoomInfoProps> = ({
  me,
  room,
  onLeaveRoom = noop,
  onInviteNewPeer = noop,
  onChallenge = noop,
}) => {
  const cls = useStyle();
  const [showAddModal, setShowAddModal] = useState(false);
  return (
    <>
      <div className={cls.roomInfoContainer}>
        <div className={cls.headerContainer}>
          <div className={cls.roomTitleContainer}>
            <span style={{ fontWeight: 'lighter' }}>Room: </span>
            <span style={{ fontWeight: 'bold' }}>{room.name}</span>
          </div>
          <div className={cls.addPeerContainer}>
            <FontAwesomeIcon
              icon={faUserPlus}
              size="lg"
              onClick={() => setShowAddModal(true)}
            />
          </div>
        </div>
        <div className={cls.challengeContainer}>
          <div className={cls.challengeBillboard}>Click on a peer to challenge</div>
        </div>
        <div className={cls.listContainer}>
          <RoomListPeer
          // TODO: I think the logic for me needs to change a bit
          //  If there is no game, it will always show in the left side at the bottom (home)
          //  If there is game going and "me" is not a player, than it will be moved here, into
          //   the spectators area, but without the ability to challenge. Maybe when it's here
          //   it should also display a bit different then the rest to know it/s you.
          //   Maybe always 1st or bigger or smaller or smtg :)
            avatar={Math.floor(Math.random() * 11) as avatarsType}
            peer={me}
            me
            onPeerChallenge={() => onChallenge?.(me.id)}
          />
          {Object.values(room.peers).map((peer) => (
            <div>
              <RoomListPeer
                me={false}
                avatar={Math.floor(Math.random() * 11) as avatarsType}
                peer={peer}
                onPeerChallenge={() => onChallenge(peer.id)}
              />
            </div>
          ))}
        </div>
        <div className={cls.endContainer}>
          <ColoredButton
            label="End Game"
            color="#F7627B"
            fontSize="18px"
            padding="8px"
            borderRadius="21px"
            width="114px"
            onClickFunction={onLeaveRoom}
          />
        </div>
        <div className={cls.leaveContainer}>
          <ColoredButton
            label="Leave Room"
            color="#F7627B"
            fontSize="18px"
            padding="8px"
            borderRadius="21px"
            onClickFunction={onLeaveRoom}
          />
        </div>
      </div>
      {room.type === 'private' && (
        <PopupModal show={showAddModal}>
          <AddNewPeerPopUp
            code={room.code}
            close={() => setShowAddModal(false)}
          />
        </PopupModal>
      )}
    </>
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
  challengeBillboard: {
    backgroundColor: '#EFE7E8',
    borderRadius: '8px',
    color: '#6C6767',
    fontFamily: 'Open Sans',
    fontSize: '14px',
    padding: '5px',
    boxShadow: '1px 1px 8px rgba(0, 0, 0, 0.24)',
    textAlign: 'center',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    // borderBottom: '2px solid #6792B4',
    justifyContent: 'space-between',
    marginBottom: '10px',
    alignItems: 'baseline',
  },
  challengeContainer: {
    marginBottom: '10px',
  },
  roomTitleContainer: {

  },
  addPeerContainer: {
    borderRadius: '8px',
    padding: '8px',
    '&:hover': {
      boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.19)',
      cursor: 'pointer',
    },
  },
  listContainer: {
    // overflowY: 'scroll',
    // overflowX: 'hidden',
  },
  endContainer: {
    marginTop: '20px',
  },
  leaveContainer: {
    marginTop: '15px',
  },
});
