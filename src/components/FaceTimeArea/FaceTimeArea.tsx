import React from 'react';
import { PeerRecord } from 'dstnd-io';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { PeerConnectionStatus } from 'src/services/peers';
import { AVStream } from '../AVStream';

type Props = {
  me: PeerRecord;

  localStream?: MediaStream;
  startStreaming: () => void;
  stopStreaming: () => void;

  peerConnections: PeerConnectionStatus[];
};

export const FaceTimeArea: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <>
      <>
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
      </>
      {Object.values(props.peerConnections).map((peerConnection) => (
        <div className={cls.container} key={peerConnection.peerId}>
          {peerConnection.peerId}
          {peerConnection.channels.streaming.on
            ? (
              <>
                <div>
                  {`Streaming On ${peerConnection.channels.streaming.type}`}
                </div>
                <AVStream
                  stream={peerConnection.channels.streaming.stream}
                  autoPlay
                  muted
                  className={cls.videoBox}
                />
              </>
            ) : (
              <div className={cls.videoBox}>
                Streaming Off
              </div>
            )}
        </div>
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
