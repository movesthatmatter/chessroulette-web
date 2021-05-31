import React, { useEffect, useReducer } from 'react';
import { FaceTime, FaceTimeProps } from 'src/components/FaceTime';
import { createUseStyles } from 'src/lib/jss';
import { getUserDisplayName } from 'src/modules/User';
import { fonts, softBorderRadius } from 'src/theme';
import { Streamer, StreamersMap } from '../types';
import { Reel } from './components/Reel/Reel';
import { reducer, initialState, initAction, focusAction, updateAction } from './reducer';

type OverlayedNodeRender = (p: { inFocus: Streamer['user'] }) => React.ReactNode;

export type MultiStreamingBoxProps = {
  streamersMap: StreamersMap;
  focusedUserId?: Streamer['user']['id'];
  headerOverlay?: OverlayedNodeRender;
  footerOverlay?: OverlayedNodeRender;
  mainOverlay?: OverlayedNodeRender;
} & Omit<FaceTimeProps, 'streamConfig' | 'footer' | 'header'>;

export const MultiStreamingBox: React.FC<MultiStreamingBoxProps> = ({
  streamersMap,
  focusedUserId,
  headerOverlay,
  mainOverlay,
  footerOverlay,
  ...faceTimeProps
}) => {
  const cls = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch(
      initAction({
        streamersMap: streamersMap,
        focusedUserId: focusedUserId,
      })
    );
  }, []);

  useEffect(() => {
    if (focusedUserId) {
      dispatch(
        focusAction({
          userId: focusedUserId,
        })
      );
    }
  }, [focusedUserId]);

  useEffect(() => {
    dispatch(
      updateAction({
        streamersMap: streamersMap,
      })
    );
  }, [streamersMap]);

  if (!state.ready) {
    return null;
  }

  return (
    <div className={cls.container}>
      <FaceTime
        streamConfig={state.inFocus.streamingConfig}
        label={state.reel.length > 0 ? getUserDisplayName(state.inFocus.user) : ''}
        labelPosition="bottom-left"
        {...faceTimeProps}
      />
      <div className={cls.overlayedContainer}>
        <div className={cls.headerWrapper}>
          {headerOverlay ? headerOverlay({ inFocus: state.inFocus.user }) : null}
        </div>
        <div className={cls.mainWrapper}>
          <div className={cls.mainOverlayWrapper}>
            {mainOverlay ? mainOverlay({ inFocus: state.inFocus.user }) : null}
          </div>
          <div className={cls.reelWrapper}>
            <div className={cls.reelScroller}>
              <Reel
                reel={state.reel}
                onClick={(userId) => {
                  dispatch(focusAction({ userId }));
                }}
              />
            </div>
          </div>
        </div>
        <div className={cls.footerWrapper}>
          {footerOverlay ? footerOverlay({ inFocus: state.inFocus.user }) : null}
        </div>
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    position: 'relative',

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
    paddingRight: '8px',
    paddingBottom: '8px',
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
    }
  },
  reel: {},
  smallFacetimeWrapper: {
    marginTop: '8%',
    ...softBorderRadius,
    overflow: 'hidden',
    position: 'relative',
  },
  smallFacetime: {},
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
