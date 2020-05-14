import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { PeerRecord } from 'dstnd-io';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { FaceTime } from 'src/components/FaceTimeArea/FaceTime';
import { PeerConnectionStatus } from 'src/services/peers';

type Props = {
  peer: PeerRecord;
  onPeerChallenge: () => void;
  avatar: AvatarsType;
  isMe: boolean;
  streamConfig: PeerConnectionStatus['channels']['streaming'];
  canChallenge: boolean;
  onDisplayChallengeName: (value: string) => void;
};
export type AvatarsType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export const RoomListPeer: React.FC<Props> = ({
  peer,
  onPeerChallenge,
  avatar,
  isMe,
  streamConfig,
  canChallenge,
  onDisplayChallengeName,
}) => {
  const cls = useStyle();
  const [over, setMouseOver] = useState(false);

  const checkMouseOver = () => {
    if (canChallenge) {
      onDisplayChallengeName(peer.name);
    }
    setMouseOver(true);
  };

  const checkMouseOut = () => {
    setMouseOver(false);
    onDisplayChallengeName('');
  };

  return (
    <div
      className={cls.listItem}
      onMouseOver={() => checkMouseOver()}
      onMouseOut={() => checkMouseOut()}
      onFocus={() => checkMouseOver()}
      onBlur={() => checkMouseOut()}
      onClick={() => onPeerChallenge()}
    >
      <div className={cls.topBar}>
        {streamConfig.on && (
          <div className={cls.mutunachi}>
            <Mutunachi mid={avatar} style={{ height: '35px' }} />
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
        {streamConfig.on ? (
          <FaceTime streamConfig={streamConfig} />
        ) : (
          <div className={cls.mutunachiLarge}>
            <Mutunachi mid={avatar} style={{ height: '90px' }} />
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
      background:
      // eslint-disable-next-line max-len
        'linear-gradient(#EFE7E8 0% ,rgba(232, 232, 232, 0) 100%)',
    },
    padding: '5px',
  },
  topBar: {
    display: 'flex',
    paddingLeft: '10px',
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
    alignSelf: 'center',
  },
  videoContainer: {

  },
  mutunachiLarge: {

  },
  challenge: {

  },
});
