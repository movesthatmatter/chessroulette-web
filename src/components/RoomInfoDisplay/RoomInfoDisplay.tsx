import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { faUserPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RoomStatsRecord, PeerRecord } from 'dstnd-io';
import { noop } from 'src/lib/util';
import { PopupModal } from 'src/components/PopupModal/PopupModal';
import { AddNewPeerPopUp } from 'src/components/AddNewPeerPopup/AddNewPeerPopup';
import { PeerConnections } from 'src/components/PeersProvider';
import { RoomListPeer, AvatarsType } from './RoomListPeer/RoomListPeer';


export type RoomInfoProps = {
  me: PeerRecord;
  room: RoomStatsRecord;
  peerConnections: PeerConnections;
  players: Record<string, {id: string}> | undefined;
  localStream? : MediaStream | void;
  onLeaveRoom?: (roomId?: string) => void;
  onInviteNewPeer?: () => void;
  onChallenge?: (peerId: string) => void;
  gamePlayable? : boolean;
};

const setTitleState = (game: boolean | undefined, peers: number): string => {
  if (peers >= 2) {
    if (!game) {
      return 'Game in progress';
    }
    return 'Click on a peer to challenge';
  }
  return 'Invite a friend to start playing!';
};

export const RoomInfoDisplay: React.FC<RoomInfoProps> = ({
  me,
  room,
  peerConnections,
  players,
  localStream,
  onLeaveRoom = noop,
  onInviteNewPeer = noop,
  onChallenge = noop,
  gamePlayable,
}) => {
  const cls = useStyle();
  const [showAddModal, setShowAddModal] = useState(false);
  const [toChallenge, setToChallenge] = useState('');

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
            {toChallenge !== '' && gamePlayable
              ? `Challenge : ${toChallenge}`
              : setTitleState(gamePlayable, room.peersCount)}

          </div>
        </div>
        <div className={cls.listContainer}>
          {room.peersCount > 1
            ? (Object.values(room.peers).map((peer) => {
              if (players
              && Object.values(players).filter((player) => player.id === peer.id).length > 0) {
                return null;
              }
              return (
                <div className={cls.listItem}>
                  <RoomListPeer
                    me={peer.id === me.id}
                    peer={peer}
                    streaming={(peer.id === me.id) && (localStream)
                      ? {
                        on: true,
                        stream: localStream,
                        type: 'audio-video',
                      }
                      : peerConnections[peer.id].channels.streaming}
                    avatar={peer.id.slice(-1)[0] as unknown as AvatarsType}
                    onPeerChallenge={() => onChallenge(peer.id)}
                    canChallenge={peer.id !== me.id && gamePlayable === true}
                    onDisplayChallengeName={(value: string) => setToChallenge(value)}
                  />
                </div>
              );
            }))
            : (
              <div>
                Waiting for peers. User invite button to
                share the room and invite your friends

              </div>
            )}
        </div>
      </div>
      {room.type === 'private' && (
        <PopupModal show={showAddModal}>
          <AddNewPeerPopUp
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
  challengeBillboard: {

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
