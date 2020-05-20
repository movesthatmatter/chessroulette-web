import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { Room } from '../RoomProvider';

type Props = {
  room: Room;
};

export const RoomStats: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <>
      <div>
        {`Room: ${props.room.name}(${props.room.id}) - ${props.room.peersCount} Peers`}
      </div>
      <div>
        {`Me: ${props.room.me.name}(${props.room.me.id})`}
      </div>
      <div>
        <div>Peers:</div>
        {Object.values(props.room.peers).map(
          ({ id, name, connection }) => (
            <div key={id}>
              <span>{`Peer: ${name}(${id})`}</span>
              <div>
                <small>
                  {/* <span>
                    Connection Status:
                    <div className={cx(cls.dot, {
                      [cls.greenDot]: isConnected,
                      [cls.redDot]: !isConnected,
                    })}
                    />
                  </span> */}
                  <span>
                    [Data:
                    <div className={cx(cls.dot, {
                      [cls.greenDot]: connection.channels.data.on,
                      [cls.redDot]: !connection.channels.data.on,
                    })}
                    />
                  </span>
                  <span>
                    Audio:
                    <div className={cx(cls.dot, {
                      [cls.greenDot]: connection.channels.streaming.on && connection.channels.streaming.type !== 'video',
                      [cls.redDot]: !(connection.channels.streaming.on && connection.channels.streaming.type !== 'video'),
                    })}
                    />
                  </span>
                  <span>
                    Video:
                    <div className={cx(cls.dot, {
                      [cls.greenDot]: connection.channels.streaming.on && connection.channels.streaming.type !== 'audio',
                      [cls.redDot]: !(connection.channels.streaming.on && connection.channels.streaming.type !== 'audio'),
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
