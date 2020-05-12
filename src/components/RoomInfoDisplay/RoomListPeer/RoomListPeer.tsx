import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChess } from '@fortawesome/free-solid-svg-icons';
import { PeerRecord } from 'dstnd-io';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';

type Props = {
  peer: PeerRecord;
  onPeerChallenge: () => void;
  avatar: avatarsType;
  me: boolean;
};
export type avatarsType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export const RoomListPeer: React.FC<Props> = ({
  peer,
  onPeerChallenge,
  avatar,
  me,
}) => {
  const cls = useStyle();
  const [over, setMouseOver] = useState(false);

  return (
    <div
      className={cls.listItem}
      onMouseOver={() => setMouseOver(true)}
      onMouseOut={() => setMouseOver(false)}
      onFocus={() => setMouseOver(true)}
      onBlur={() => setMouseOver(false)}
    >
      <div className={cls.mutunachi}>
        <Mutunachi mid={avatar} height="35px" />
      </div>
      <div
        className={cls.peerNameContainer}
        style={{ fontWeight: me ? 'bold' : 'normal' }}
      >
        {peer.name}
      </div>
      <div
        style={{ opacity: `${over ? '1' : '0'}` }}
        className={cls.chessIconContainer}
      >
        <FontAwesomeIcon
          size="xs"
          icon={faChess}
          className={cls.chessIcon}
          onClick={() => onPeerChallenge()}
        />
      </div>
    </div>
  );
};

const useStyle = createUseStyles({
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: '3px 0px',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
      background:
        'linear-gradient(to right,  rgba(232, 232, 232, 0) 0%, rgba(241, 241, 241, 0.71) 45.83% ,#F9F9F9 100%)',
    },
  },
  chessIconContainer: {
    marginRight: '10px',
    width: '36px',
  },
  chessIcon: {
    padding: '5px',
    borderRadius: '12px',
    boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.19)',
    '&:hover': {
      transform: 'scale(1.3)',
    },
  },
  mutunachi: {
    marginRight: '20px',
    width: '45px',
  },
  peerNameContainer: {
    width: '100%',
  },
});
