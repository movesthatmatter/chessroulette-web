import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVideoSlash, faVolumeMute, faVolumeUp, faVideo, faChess,
} from '@fortawesome/free-solid-svg-icons';

const icons = {
  chess: faChess,
  video: faVideo,
  videoMute: faVideoSlash,
  volume: faVolumeUp,
  volumeMute: faVolumeMute,
};
type video = typeof icons.video | typeof icons.videoMute;
type audio = typeof icons.volume | typeof icons.volumeMute;

export const RoomListPeer = ({ peerName, onPeerChallenge }: {
  peerName: string;
  onPeerChallenge: () => void;
}) => {
  const cls = useStyle();
  const [over, setMouseOver] = useState<boolean>(false);
  const [videoIcon, toggleVideo] = useState<video>(icons.video);
  const [audioIcon, toggleAudio] = useState<audio>(icons.volume);
  return (
    <div
      className={cls.listItem}
      onMouseOver={() => setMouseOver(true)}
      onMouseOut={() => setMouseOver(false)}
      onFocus={() => setMouseOver(true)}
      onBlur={() => setMouseOver(false)}
    >
      <div style={{ opacity: `${over ? '1' : '0'}` }} className={cls.chessIconContainer}>
        <FontAwesomeIcon
          size="xs"
          icon={faChess}
          className={cls.chessIcon}
          onClick={() => onPeerChallenge()}
        />
      </div>
      <div className={cls.peerNameContainer}>
        {peerName.replace(/^\w/, (c) => c.toUpperCase())}
      </div>
      <div className={cls.videoIconContainer}>
        <FontAwesomeIcon
          size="xs"
          icon={videoIcon}
          className={cls.videoIcon}
          onClick={() => toggleVideo((prev) => {
            if (prev === icons.video) {
              return icons.videoMute;
            }
            return icons.video;
          })}
        />
      </div>
      <div className={cls.volumeIconContainer}>
        <FontAwesomeIcon
          size="xs"
          icon={audioIcon}
          className={cls.volumeIcon}
          onClick={() => toggleAudio((prev) => {
            if (prev === icons.volume) {
              return icons.volumeMute;
            }
            return icons.volume;
          })}
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
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#F9F9F9',
    },
  },
  chessIconContainer: {
    paddingRight: '10px',
    width: '36px',
  },
  videoIconContainer: {
    paddingRight: '5px',
  },
  volumeIconContainer: {
    paddingLeft: '5px',
  },
  chessIcon: {
    padding: '5px',
    borderRadius: '12px',
    boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.19)',
    '&:hover': {
      transform: 'scale(1.3)',
    },
  },
  videoIcon: {
    padding: '5px',
    borderRadius: '12px',
    boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.19)',
    transition: 'all 0.1s ease-in-out',
    '&:hover': {
      transform: 'scale(1.3)',
    },
  },
  volumeIcon: {
    padding: '5px',
    borderRadius: '12px',
    boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.19)',
    transition: 'all 0.1s ease-in-out',
    '&:hover': {
      transform: 'scale(1.3)',
    },
  },
  peerNameContainer: {
    width: '100%',
  },
});
