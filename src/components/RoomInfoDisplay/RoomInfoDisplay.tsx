import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColoredButton } from 'src/components/ColoredButton/ColoredButton';
import { RoomListPeer } from './RoomListPeer/RoomListPeer';

export type RoomInfoProps = {
  me: string;
  peers: string[];
  roomName: string;
  roomID: string;
  onLeaveRoom: (roomId?: string) => void;
  onInviteNewPeer: () => void;
  onChallenge: (peerID?: string) => void;
};

export const RoomInfoDisplay = ({
  me,
  peers,
  roomName,
  roomID,
  onLeaveRoom,
  onInviteNewPeer,
  onChallenge,
}: RoomInfoProps) => {
  const cls = useStyle();
  return (
    <div className={cls.roomInfoContainer}>
      <div className={cls.headerContainer}>
        <div className={cls.roomTitleContainer}>{roomName}</div>
        <div className={cls.addPeerContainer}>
          <FontAwesomeIcon
            icon={faUserPlus}
            size="lg"
          />
        </div>
      </div>
      <div className={cls.listContainer}>

        <RoomListPeer peerName={me} onPeerChallenge={() => onChallenge(me)} />
        {peers.map((peer) => (
          <div>
            <RoomListPeer peerName={peer} onPeerChallenge={() => onChallenge(peer)} />
          </div>
        ))}
      </div>
      <div className={cls.buttonContainer}>
        <ColoredButton
          label="Leave Room"
          color="#E66162"
          fontSize="18px"
          padding="4px"
          onClickFunction={() => console.log('Leave ROOM')}
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
  listContainer: {

  },
  buttonContainer: {
    marginTop: '20px',
  },
});
