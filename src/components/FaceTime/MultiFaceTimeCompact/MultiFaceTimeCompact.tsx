import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { MyFaceTime } from '../MyFaceTime';
import { Peer, PeersMap } from 'src/providers/PeerProvider';
import { MultiStreamingBox, MultiStreamingBoxProps } from './MultiStreamingBox';
import cx from 'classnames';

export type MultiFaceTimeCompactProps = {
  me: Peer;
  peersMap: PeersMap;

  width?: number;
  focusedPeerId?: Peer['id'];
  aspectRatio?: MultiStreamingBoxProps['aspectRatio'];
  containerClassName?: string;

  headerOverlay?: MultiStreamingBoxProps['headerOverlay'];
  mainOverlay?: MultiStreamingBoxProps['mainOverlay'];
  footerOverlay?: MultiStreamingBoxProps['footerOverlay'];
};

// TODO: Refactor the need to have a FAcetime Here - this is why hte transion from me to multiple looks weird now!
export const MultiFaceTimeCompact: React.FC<MultiFaceTimeCompactProps> = (props) => {
  const cls = useStyles();

  return (
    <div
      className={cx(cls.container, props.containerClassName)}
      style={{ width: props.width || '100%' }}
    >
      {Object.keys(props.peersMap).length > 0 ? (
        <MultiStreamingBox
          focusedUserId={props.focusedPeerId}
          peersMap={props.peersMap}
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
            props.headerOverlay ? props.headerOverlay({ inFocus: props.me.user }) : null
          }
          mainOverlay={props.mainOverlay ? props.mainOverlay({ inFocus: props.me.user }) : null}
          footerOverlay={
            props.footerOverlay ? props.footerOverlay({ inFocus: props.me.user }) : null
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
