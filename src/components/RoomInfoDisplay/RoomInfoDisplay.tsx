import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { faUserPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RoomStatsRecord, PeerRecord } from 'dstnd-io';
import { noop } from 'src/lib/util';
import { PopupModal } from 'src/components/PopupModal/PopupModal';
import { AddNewPeerPopUp } from 'src/components/AddNewPeerPopup/AddNewPeerPopup';
import { PeerConnections } from 'src/components/PeersProvider';
import { PeerConnectionStatus } from 'src/services/peers';
import { GameChallengeRecord } from 'src/modules/GameRoom/records';
import { RoomListPeer, AvatarsType } from './RoomListPeer/RoomListPeer';


export type RoomInfoProps = {
  me: PeerRecord;
  room: RoomStatsRecord;
  peerConnections: PeerConnections;
  playersById: Record<string, {id: string}>;
  gameInProgress: boolean;

  localStream?: MediaStream;
  onLeaveRoom?: (roomId?: string) => void;
  onInviteNewPeer?: () => void;
  onChallenge?: (challenge: GameChallengeRecord) => void;
};

const setTitleState = (gameInProgress: boolean, peers: number): string => {
  if (peers >= 2) {
    if (gameInProgress) {
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
  playersById,
  localStream,
  gameInProgress,
  onLeaveRoom = noop,
  onInviteNewPeer = noop,
  onChallenge = noop,
}) => {
  const cls = useStyle();
  const [showAddModal, setShowAddModal] = useState(false);
  const [toChallenge, setToChallenge] = useState('');

  // Only deal with the peers that are connection via P2P not Socket
  //  as those don't mean much yet :)
  //  (meaning you need to be connection via P@P to be able to stream and play)
  const peerConnectionsWithoutPlayers = Object
    .values(peerConnections)
    .filter((pc) => !(pc.peerId in playersById));

  const myStreamConfig: PeerConnectionStatus['channels']['streaming'] = {
    ...localStream ? {
      on: true,
      stream: localStream,
      type: 'audio-video', // assume this for now but it isn't good. It should come from localStream
    } : {
      on: false,
    },
  };

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
            {toChallenge !== '' && gameInProgress
              ? `Challenge : ${toChallenge}`
              : setTitleState(gameInProgress, room.peersCount)}

          </div>
        </div>
        <div className={cls.listContainer}>
          {(peerConnectionsWithoutPlayers.length === 0) && (
            <div>
              Waiting for peers. User invite button to
              share the room and invite your friends
            </div>
          )}
          {peerConnectionsWithoutPlayers.map((pc) => (
            <div className={cls.listItem} key={pc.peerId}>
              <RoomListPeer
                isMe={pc.peerId === me.id}
                peer={room.peers[pc.peerId]}
                streamConfig={(pc.peerId === me.id) ? myStreamConfig : pc.channels.streaming}
                // TODO: Add a typesafe util to do this avatar slicing
                avatar={pc.peerId.slice(-1)[0] as unknown as AvatarsType}
                onPeerChallenge={() => onChallenge({
                  challengerId: me.id,
                  challengeeId: pc.peerId,
                })}
                canChallenge={!gameInProgress && pc.peerId === me.id}
                onDisplayChallengeName={(value) => setToChallenge(value)}
              />
            </div>
          ))}
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
