import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { MyFaceTime } from '../FaceTimeArea';
import { Peer, Room } from '../RoomProvider';
import { MultiStreamingBox, MultiStreamingBoxProps } from './MultiStreamingBox';
import cx from 'classnames';

export type StreamingBoxProps = {
  room: Room;
  width?: number;
  focusedPeerId?: Peer['id'];
  aspectRatio?: MultiStreamingBoxProps['aspectRatio'];
  containerClassName?: string;

  headerOverlay?: MultiStreamingBoxProps['headerOverlay'];
  mainOverlay?: MultiStreamingBoxProps['mainOverlay'];
  footerOverlay?: MultiStreamingBoxProps['footerOverlay'];
};

export const StreamingBox: React.FC<StreamingBoxProps> = (props) => {
  const cls = useStyles();

  const activeStreamers = Object.values(props.room.peers).reduce((prev, next) => {
    if (!next.connection.channels.streaming.on) {
      return prev;
    }

    return {
      ...prev,
      [next.id]: {
        user: next.user,
        streamingConfig: next.connection.channels.streaming,
      },
    };
  }, {});

  return (
    <div
      className={cx(cls.container, props.containerClassName)}
      style={{ width: props.width || '100%' }}
    >
      {Object.keys(activeStreamers).length > 0 ? (
        <MultiStreamingBox
          focusedUserId={props.focusedPeerId}
          streamersMap={activeStreamers}
          aspectRatio={props.aspectRatio}
          footerOverlay={props.footerOverlay}
          headerOverlay={props.headerOverlay}
          mainOverlay={props.mainOverlay}
          // No label here for now!
          label={undefined}
        />
      ) : (
        <MyFaceTime
          aspectRatio={props.aspectRatio}
          headerOverlay={
            props.headerOverlay ? props.headerOverlay({ inFocus: props.room.me.user }) : null
          }
          mainOverlay={
            props.mainOverlay ? props.mainOverlay({ inFocus: props.room.me.user }) : null
          }
          footerOverlay={
            props.footerOverlay ? props.footerOverlay({ inFocus: props.room.me.user }) : null
          }
        />
      )}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    position: 'relative',
  },
  reel: {
    position: 'absolute',
    bottom: '15px',
    right: '10px',
  },
  smallFacetime: {
    border: '2px solid rgba(0, 0, 0, .3)',
  },
  fullFacetime: {},
  noFacetime: {
    background: '#ededed',
  },
  title: {
    background: 'rgba(255, 255, 255, .8)',
    textAlign: 'center',
    padding: '5px',
    borderRadius: '5px',
  },
  titleWrapper: {
    position: 'absolute',
    top: '20px',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
});
