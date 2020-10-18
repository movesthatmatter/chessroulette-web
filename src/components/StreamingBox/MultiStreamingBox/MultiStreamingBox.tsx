import { UserRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { FaceTime } from 'src/components/FaceTimeArea';
import { createUseStyles } from 'src/lib/jss';
import hark from 'hark';
import { PeerStreamingConfig, PeerStreamingConfigOn } from 'src/services/peers';
import { Text } from 'grommet';
import cx from 'classnames';

type StreamId = string;

type PeerStreamingConfigWithUser = {
  streamingConfig: PeerStreamingConfigOn;
  user: UserRecord;
};

type Props = {
  peerStreamingConfigMap: Record<StreamId, PeerStreamingConfigWithUser>;
  myStreamingConfig: {
    streamingConfig: PeerStreamingConfig;
    user: UserRecord;
  };
  focusOn?: StreamId;
  reelFacetimeWidth: number;
};

export const MultiStreamingBox: React.FC<Props> = (props) => {
  const cls = useStyles();

  const getPeerStreamingOrFallback = (id?: string, fallbackId?: string): PeerStreamingConfigWithUser => {
    if (Object.keys(props.peerStreamingConfigMap).length === 0) {
      throw new Error('MultiStreamingBox Empty Peer Streaming Config Map Error');
    }

    return (id && id in props.peerStreamingConfigMap)
      ? props.peerStreamingConfigMap[id]
      : getPeerStreamingOrFallback(fallbackId, Object.keys(props.peerStreamingConfigMap)[0])
  }

  const [focused, setFocused] = useState<PeerStreamingConfigWithUser>(getPeerStreamingOrFallback(props.focusOn));

  useEffect(() => {
    // Make sure the focused is set anytime there are changes to the peers
    //  If new peer added, stays the same
    //  If not focused peer remove, stays the same
    //  If focused peer removed, fallsback to 1st one or throws error if there are none left
    //   atlhough at that point it shouldn't be rendered anymore
    //  TODO: make sure that works correctly
    setFocused((prev) => getPeerStreamingOrFallback(prev.user.id));

    const peerStreamConfigKeys = Object.keys(props.peerStreamingConfigMap);

    if (peerStreamConfigKeys.length < 2) {
      return () => {};
    }

    const allHarkStoppers = peerStreamConfigKeys
      .map((id) => {
        const speechEvents = hark(props.peerStreamingConfigMap[id].streamingConfig.stream);

        speechEvents.on('speaking', () => {
          setFocused((prev) => getPeerStreamingOrFallback(id, prev.user.id));
        });
      
        speechEvents.on('stopped_speaking', () => {
          console.log(id, 'stopped speaking');
        });
      
        speechEvents.on('state_change', (e) => {
          console.log(id, 'stream state changed', e);
        });

        return () => speechEvents.stop();
      });

    return () => {
      allHarkStoppers.forEach((stopHark) => stopHark());
    }
  }, [props.peerStreamingConfigMap]);

  return (
    <div className={cls.container}>
      <FaceTime streamConfig={focused.streamingConfig}/>
      <div className={cls.titleWrapper}>
        <Text className={cls.title}>{focused.user.name}</Text>
      </div>
      <div className={cls.reel}>
        {Object
          .values(props.peerStreamingConfigMap)
          .map(({ streamingConfig, user }) => (
            <div
              className={cls.smallFacetimeWrapper}
              key={user.id}
              style={{
                // Don't shpw the currently focused one
                display: user.id === focused.user.id ? 'none' : 'block',
              }}
            >
              <div className={cx(cls.titleWrapper, cls.smallTitleWrapper)}>
                <Text size="small" className={cls.title}>{user.name}</Text>
              </div>
              <FaceTime
                streamConfig={streamingConfig}
                className={cls.smallFacetime}
                style={{
                  width: props.reelFacetimeWidth,
                }}
              />
            </div>
          ))}
          <div className={cls.smallFacetimeWrapper}>
            <div className={cx(cls.titleWrapper, cls.smallTitleWrapper)}>
              <Text size="small" className={cls.title}>Me</Text>
            </div>
            <FaceTime
              streamConfig={props.myStreamingConfig.streamingConfig}
              className={cls.smallFacetime}
              style={{
                width: props.reelFacetimeWidth,
              }}
              muted
            />
          </div>
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
  titleWrapper: {
    position: 'absolute',
    top: '20px',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  smallTitleWrapper: {
    top: '10px',
  },
  title: {
    background: 'rgba(255, 255, 255, .8)',
    textAlign: 'center',
    padding: '5px',
    borderRadius: '5px',
  },
  reel: {
    position: 'absolute',
    bottom: '15px',
    right: '10px',
  },
  smallFacetimeWrapper: {
    position: 'relative',
  },
  smallFacetime: {
    // position: 'absolute',
    border: '2px solid rgba(0, 0, 0, .3)',
    // opacity: 0.95,
  },
});