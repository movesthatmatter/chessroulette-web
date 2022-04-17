import React, { useMemo } from 'react';
import cx from 'classnames';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { FaceTime, FaceTimeProps } from '../FaceTime';
import { getUserDisplayName } from 'src/modules/User';
import { Reel } from './components/Reel';
import { fonts, softBorderRadius } from 'src/theme';
import { MyFaceTime } from '../MyFaceTime';
import { StreamingPeer } from 'src/providers/PeerConnectionProvider';

type OverlayedNodeRender = (p: { inFocus?: StreamingPeer['user'] }) => React.ReactNode;

export type MultiFaceTimeCompactProps = {
  reel?: {
    streamingPeers: StreamingPeer[];
    myStreamingPeerId: StreamingPeer['userId'];
    focusedStreamingPeer: StreamingPeer;
  };

  onFocus: (userId: StreamingPeer['id']) => void;

  width?: number;
  containerClassName?: string;

  headerOverlay?: OverlayedNodeRender;
  footerOverlay?: OverlayedNodeRender;
  mainOverlay?: OverlayedNodeRender;
} & Omit<FaceTimeProps, 'streamConfig' | 'footer' | 'header' | 'onFocus'>;

export const MultiFaceTimeCompact: React.FC<MultiFaceTimeCompactProps> = ({
  reel,
  onFocus,

  containerClassName,
  width,
  headerOverlay,
  footerOverlay,
  mainOverlay,

  ...faceTimeProps
}) => {
  const cls = useStyles();
  const containerStyles = useMemo(() => ({ width: width || '100%' }), [width]);
  const label = useMemo(() => {
    if (!reel) {
      return '';
    }

    return reel.focusedStreamingPeer.id === reel.myStreamingPeerId
      ? getUserDisplayName(reel.focusedStreamingPeer.user)
      : '';
  }, [reel]);
  const inFocusUserOverlay = useMemo(() => ({ inFocus: reel?.focusedStreamingPeer.user }), [reel]);

  return (
    <div className={cx(cls.container, containerClassName)} style={containerStyles}>
      {reel ? (
        <FaceTime
          streamConfig={reel.focusedStreamingPeer.connection.channels.streaming}
          label={label}
          labelPosition="bottom-left"
          {...faceTimeProps}
        />
      ) : (
        <MyFaceTime {...faceTimeProps} label={label} labelPosition="bottom-left" />
      )}
      <div className={cls.overlayedContainer}>
        <div className={cls.headerWrapper}>
          {headerOverlay ? headerOverlay(inFocusUserOverlay) : null}
        </div>
        <div className={cls.mainWrapper}>
          <div className={cls.mainOverlayWrapper}>
            {mainOverlay ? mainOverlay(inFocusUserOverlay) : null}
          </div>
          {reel && (
            <div className={cls.reelWrapper}>
              <div className={cls.reelScroller}>
                <Reel streamingPeers={reel.streamingPeers} onClick={onFocus} />
              </div>
            </div>
          )}
        </div>
        <div className={cls.footerWrapper}>
          {footerOverlay ? footerOverlay(inFocusUserOverlay) : null}
        </div>
      </div>
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
  overlayedContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,

    display: 'flex',
    flexDirection: 'column',
  },
  headerWrapper: {},
  footerWrapper: {},
  mainWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    minHeight: 0,
  },
  faceTimeAsButton: {
    cursor: 'pointer',
  },
  mainOverlayWrapper: {
    flex: 1,
  },
  reelWrapper: {
    display: 'flex',
    flex: '0 1 auto',
    overflow: 'auto',

    width: '22.2%',
    paddingRight: spacers.get(0.7),
    paddingBottom: spacers.get(0.7),
  },
  reelScroller: {
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column-reverse',
    flex: 1,
    overflowY: 'auto',

    // overscroll: auto;
    msOverflowStyle: '-ms-autohiding-scrollbar',

    '&:hover': {
      // overflowY: 'scroll',
    },
  },
  smallFacetimeWrapper: {
    marginTop: '8%',
    ...softBorderRadius,
    overflow: 'hidden',
    position: 'relative',
  },
  smallFacetimeBorder: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    boxShadow: 'inset 0 0 1px 1px white',
    ...softBorderRadius,
  },
  smallFacetimeLabel: {
    ...fonts.small3,
  },
});
