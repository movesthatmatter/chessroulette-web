import React from 'react';
import { PeerRecord, RoomStatsRecord } from 'dstnd-io';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { PeersProvider } from '../PeersProvider';
import { SocketConsumer } from '../SocketProvider';

type Props = {
  me: PeerRecord;
  room: RoomStatsRecord;
};

export const RoomStats: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <SocketConsumer
      render={({ socket }) => (
        <PeersProvider
          me={props.me}
          peers={Object.values(props.room.peers)}
          socket={socket}
          render={({ peerConnections }) => (
            <>
              <div>
                {props.room.name}
                {' '}
                Room Stats:
              </div>
              <div>
                <p>Peers:</p>
                {Object.values(peerConnections).map(
                  ({ peerId, isConnected, channels }) => (
                    <div key={peerId}>
                      {props.room.peers[peerId].name}
                      <div>
                        <small>
                          <span>
                            Connection Status:
                            <div className={cx(cls.dot, {
                              [cls.greenDot]: channels.data.on,
                              [cls.redDot]: !channels.data.on,
                            })}
                            />
                          </span>
                          <span>
                            [Data:
                            <div className={cx(cls.dot, {
                              [cls.greenDot]: channels.data.on,
                              [cls.redDot]: !channels.data.on,
                            })}
                            />
                          </span>
                          <span>
                            Audio:
                            <div className={cx(cls.dot, {
                              [cls.greenDot]: channels.audio.on,
                              [cls.redDot]: !channels.audio.on,
                            })}
                            />
                          </span>
                          <span>
                            Video:
                            <div className={cx(cls.dot, {
                              [cls.greenDot]: channels.video.on,
                              [cls.redDot]: !channels.video.on,
                            })}
                            />
                            ]
                          </span>
                        </small>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </>
          )}
        />
      )}
    />
  );
};
const useStyles = createUseStyles({
  dot: {
    height: '10px',
    width: '10px',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '10px',
    marginLeft: '5px',
  },
  redDot: {
    backgroundColor: 'red',
  },
  greenDot: {
    backgroundColor: 'green',
  },
});
