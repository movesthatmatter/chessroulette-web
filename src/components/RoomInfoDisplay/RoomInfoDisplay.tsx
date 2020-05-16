import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { faUserPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { noop } from 'src/lib/util';
import { PopupModal } from 'src/components/PopupModal/PopupModal';
import { AddNewPeerPopUp } from 'src/components/AddNewPeerPopup/AddNewPeerPopup';
import { GameChallengeRecord } from 'src/modules/GameRoom/records';
import { RoomListPeer } from './RoomListPeer';
import { Room, Peer } from '../RoomProvider/types';

export type RoomInfoProps = {
  me: Peer;
  room: Room;
  playersById: Record<string, { id: string }>;
  gameInProgress: boolean;

  onLeaveRoom?: (roomId?: string) => void;
  onInviteNewPeer?: () => void;
  onChallenge?: (challenge: GameChallengeRecord) => void;
};

const setTitleState = (gameInProgress: boolean, peers: number): string => {
  if (gameInProgress) {
    return 'Game in progress';
  }
  if (peers >= 2) {
    return 'Click on a peer to challenge';
  }
  return 'Invite a friend to start playing!';
};

export const RoomInfoDisplay: React.FC<RoomInfoProps> = ({
  me,
  room,
  playersById,
  gameInProgress,
  onLeaveRoom = noop,
  onInviteNewPeer = noop,
  onChallenge = noop,
}) => {
  const cls = useStyle();
  const [showAddModal, setShowAddModal] = useState(false);
  const [toChallenge, setToChallenge] = useState('');

  const nonPlayerPeersIncludingMe = Object.values(room.peers)
    .concat(me)
    .filter((peer) => !(peer.id in playersById));

  return (
    <>
      <div className={cls.roomInfoContainer}>
        <div className={cls.headerContainer}>
          <div className={cls.roomTitleContainer}>
            <span style={{ fontWeight: 'lighter' }}>Room: </span>
            <span style={{ fontWeight: 'bold' }}>{room.name}</span>
          </div>
          {room.type === 'private' && (
            <div className={cls.addPeerContainer}>
              <FontAwesomeIcon
                icon={faUserPlus}
                size="lg"
                onClick={() => setShowAddModal(true)}
              />
            </div>
          )}
          <div className={cls.leaveButton}>
            <FontAwesomeIcon
              icon={faSignOutAlt}
              size="lg"
              onClick={() => onLeaveRoom()}
              color="#F7627B"
            />
          </div>
        </div>
        <div className={cls.challengeContainer}>
          <div style={{ padding: '5px' }}>
            {toChallenge !== ''
              ? `Challenge : ${toChallenge}`
              : setTitleState(gameInProgress, room.peersCount)}
          </div>
        </div>
        <div className={cls.listContainer}>
          {nonPlayerPeersIncludingMe.length === 0 && (
            <div>
              Waiting for peers. User invite button to share the room and invite
              your friends
            </div>
          )}
          {nonPlayerPeersIncludingMe.map((peer) => (
            <div className={cls.listItem} key={peer.id}>
              <RoomListPeer
                isMe={peer.id === me.id}
                peer={peer}
                onPeerChallenge={() =>
                  onChallenge({
                    challengerId: me.id,
                    challengeeId: peer.id,
                  })}
                canChallenge={!gameInProgress && peer.id !== me.id}
                onDisplayChallengeName={setToChallenge}
              />
            </div>
          ))}
        </div>
      </div>
      {room.type === 'private' && (
        <PopupModal show={showAddModal}>
          <AddNewPeerPopUp close={() => setShowAddModal(false)} />
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
    width: '100%',
  },
  listContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  listItem: {
    flex: '0 50%',
    width: '150px',
    marginBottom: '4px',
    position: 'relative',
  },
  challengeBillboard: {},
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
    backgroundColor: '#F7627B',
    borderRadius: '8px',
    color: 'white',
    fontFamily: 'Open Sans',
    fontSize: '14px',
    boxShadow: '1px 1px 8px rgba(0, 0, 0, 0.24)',
    textAlign: 'center',
  },
  roomTitleContainer: {
    width: '100%',
  },
  addPeerContainer: {
    borderRadius: '8px',
    padding: '8px',
    '&:hover': {
      boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.19)',
      cursor: 'pointer',
    },
  },
  leaveButton: {
    borderRadius: '8px',
    padding: '8px',
    '&:hover': {
      boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.19)',
      cursor: 'pointer',
    },
  },
});
