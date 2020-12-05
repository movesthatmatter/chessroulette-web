import React, { useEffect, useReducer } from 'react';
import { FaceTime, FaceTimeProps } from 'src/components/FaceTimeArea';
import { createUseStyles } from 'src/lib/jss';
import { fonts, softBorderRadius } from 'src/theme';
import { Streamer, StreamersMap } from '../types';
import { Reel } from './components/Reel/Reel';
import { reducer, initialState, initAction, focusAction, updateAction } from './reducer';

export type MultiStreamingBoxProps = {
  streamersMap: StreamersMap;
  focusedUserId?: Streamer['user']['id'];
  aspectRatio?: FaceTimeProps['aspectRatio'],
};

export const MultiStreamingBox: React.FC<MultiStreamingBoxProps> = ({
  aspectRatio = {
    width: 4,
    height: 3,
  },
  ...props
}) => {
  const cls = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch(
      initAction({
        streamersMap: props.streamersMap,
        focusedUserId: props.focusedUserId,
      })
    );
  }, []);

  useEffect(() => {
    if (props.focusedUserId) {
      dispatch(focusAction({
        userId: props.focusedUserId,
      }))
    }
  }, [props.focusedUserId]);

  useEffect(() => {
    dispatch(updateAction({
      streamersMap: props.streamersMap,
    }))
  }, [props.streamersMap])

  if (!state.ready) {
    return null;
  }

  return (
    <div className={cls.container}>
      <FaceTime
        streamConfig={state.inFocus.streamingConfig}
        label={state.inFocus.user.name}
        labelPosition="bottom-left"
        aspectRatio={aspectRatio}
      />
      <div className={cls.reelWrapper}>
        <Reel
          reel={state.reel}
          onClick={(userId) => {
            dispatch(focusAction({ userId }));
          }}
        />
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
  reelWrapper: {
    width: '22.2%',
    position: 'absolute',
    top: '2%',
    bottom: '2%',
    right: '2%',
    overflowY: 'scroll',
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  faceTimeAsButton: {
    cursor: 'pointer',
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
