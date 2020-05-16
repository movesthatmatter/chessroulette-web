import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Mutunachi, MutunachiProps } from 'src/components/Mutunachi/Mutunachi';
import { FaceTime } from 'src/components/FaceTimeArea/FaceTime';
import { Peer } from 'src/components/RoomProvider';

type Props = {
  peer: Peer;
  isMe: boolean;
  canChallenge: boolean;
  onPeerChallenge: () => void;
  onDisplayChallengeName: (value: string) => void;
};

export const RoomListPeer: React.FC<Props> = ({
  peer,
  onPeerChallenge,
  isMe,
  canChallenge,
  onDisplayChallengeName,
}) => {
  const cls = useStyle();

  const checkMouseOver = () => {
    if (canChallenge) {
      onDisplayChallengeName(peer.name);
    }
  };

  const checkMouseOut = () => {
    onDisplayChallengeName('');
  };

  return (
    <div
      className={cls.listItem}
      onMouseOver={() => checkMouseOver()}
      onMouseOut={() => checkMouseOut()}
      onFocus={() => checkMouseOver()}
      onBlur={() => checkMouseOut()}
      onClick={() => {
        if (canChallenge) {
          onPeerChallenge();
        }
      }}
    >
      <div className={cls.topBar}>
        {peer.connection.channels.streaming.on
        && (
          <div className={cls.mutunachi}>
            <Mutunachi mid={peer.avatarId as MutunachiProps['mid']} style={{ height: '35px' }} />
          </div>
        )}
        <div
          className={cls.peerNameContainer}
          style={{
            fontWeight: isMe ? 'bold' : 'normal',
            color: isMe ? '#F7627B' : '#000000',
          }}
        >
          {peer.name}
        </div>
      </div>
      <div className={cls.videoContainer}>
        {peer.connection.channels.streaming.on ? (
          <FaceTime streamConfig={peer.connection.channels.streaming} />
        ) : (
          <div className={cls.mutunachiLarge}>
            <Mutunachi mid={peer.avatarId as MutunachiProps['mid']} style={{ height: '120px' }} />
          </div>
        )}
      </div>
    </div>
  );
};

const useStyle = createUseStyles({
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '14px',
    '&:hover': {
      cursor: 'pointer',
      background: 'linear-gradient(#EFE7E8 0% ,rgba(232, 232, 232, 0) 100%)',
    },
    padding: '5px',
  },
  topBar: {
    display: 'flex',
    marginBottom: '5px',
  },
  chessIconContainer: {
    marginRight: '10px',
    width: '36px',
  },
  chessIcon: {
    padding: '5px',
    borderRadius: '12px',
    boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.19)',
  },
  mutunachi: {
    marginRight: '10px',
  },
  peerNameContainer: {
    maxWidth: '80%',

  },
  videoContainer: {
  },
  mutunachiLarge: {},
  challenge: {},
});
