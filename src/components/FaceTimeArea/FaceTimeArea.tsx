import React, { ReactNode } from 'react';
import { PeerRecord } from 'dstnd-io';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { PeerConnectionStatus } from 'src/services/peers';
import { AVStream } from '../AVStream';
import { FaceTime } from './FaceTime';

type Props = {
  me: PeerRecord;

  localStream?: MediaStream;
  startStreaming: () => void;
  stopStreaming: () => void;

  peerConnections: PeerConnectionStatus[];

  renderPeer?: (props: {content: ReactNode}) => ReactNode;
};

export const FaceTimeArea: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <>
      <div>
        {!props.localStream ? (
          <button
            type="button"
            onClick={props.startStreaming}
          >
            Start AudioVideo Broadcasting
          </button>
        ) : (
          <>
            <div className={cls.videoBox}>
              <AVStream
                stream={props.localStream}
                autoPlay
                muted
                className={cls.videoBox}
              />
            </div>
            <button
              type="button"
              onClick={props.stopStreaming}
            >
              Stop AudioVideo Broadcasting
            </button>
          </>
        )}
      </div>
      {Object.values(props.peerConnections).map((peerConnection) => (
        <FaceTime
          key={peerConnection.peerId}
          streamConfig={peerConnection.channels.streaming}
        />
      ))}
    </>
  );
};

const useStyles = createUseStyles({
  container: {

  },
  videoBox: {
    width: '200px',
    height: '200px',
    background: '#efefef',
  },
});
