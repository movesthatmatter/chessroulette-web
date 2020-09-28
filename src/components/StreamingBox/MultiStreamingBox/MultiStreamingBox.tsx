import { UserRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { FaceTime } from 'src/components/FaceTimeArea';
import { createUseStyles } from 'src/lib/jss';
import hark from 'hark';
import { PeerStreamingConfig, PeerStreamingConfigOn } from 'src/services/peers';
import { Text } from 'grommet';
import cx from 'classnames';

type StreamId = string;

type Props = {
  peerStreamConfigsMap: Record<StreamId, {
    streamingConfig: PeerStreamingConfigOn;
    user: UserRecord;
  }>;
  myStreamConfig: {
    streamingConfi: PeerStreamingConfig;
    user: UserRecord;
  };
  focusOn?: StreamId;
  reelFacetimeWidth: number;
};

export const MultiStreamingBox: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [focusOn, setFocusOn] = useState(
    props.focusOn || Object.keys(props.peerStreamConfigsMap)[0]
  );

  useEffect(() => {
    const peerStreamConfigKeys = Object.keys(props.peerStreamConfigsMap);
    if (peerStreamConfigKeys.length < 2) {
      return () => {};
    }

    const allHarkStoppers = peerStreamConfigKeys
      .map((id) => {
        const speechEvents = hark(props.peerStreamConfigsMap[id].streamingConfig.stream);

        speechEvents.on('speaking', () => {
          console.log(id, 'started to speak');

          setFocusOn(id);
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
  }, [props.peerStreamConfigsMap, props.focusOn]);

  return (
    <div className={cls.container}>
      <FaceTime streamConfig={props.peerStreamConfigsMap[focusOn].streamingConfig}/>
      <div className={cls.titleWrapper}>
        <Text className={cls.title}>{props.peerStreamConfigsMap[focusOn].user.name}</Text>
      </div>
      <div className={cls.reel}>
        {Object
          .values(props.peerStreamConfigsMap)
          .filter(({ user }) => user.id !== props.peerStreamConfigsMap[focusOn].user.id)
          .map(({ streamingConfig, user }) => (
            <div className={cls.smallFacetimeWrapper}>
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
              streamConfig={props.myStreamConfig.streamingConfi}
              className={cls.smallFacetime}
              style={{
                width: props.reelFacetimeWidth,
              }}
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