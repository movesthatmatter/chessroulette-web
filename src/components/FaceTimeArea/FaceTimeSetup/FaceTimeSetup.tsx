import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { PeerStreamingConfig } from 'src/services/peers';
import { AspectRatio } from 'src/components/AspectRatio';
import { Box, Text } from 'grommet';
import { FaceTime } from '../FaceTime';
import { getAVStream, removeAVStream } from 'src/services/AVStreaming';

type Props = {
  onUpdated: (streamingConfig: PeerStreamingConfig) => void;
};

export const FaceTimeSetup: React.FC<Props> = (props) => {
  const cls = useStyles();

  const [streamingConfig, setStreamingConfig] = useState<PeerStreamingConfig>({ on: false });
  const [permissionState, setPermissionState] = useState<'none' | 'pending' | 'granted' | 'denied'>('none');

  const showStream = () => {
    setPermissionState('pending');

    getAVStream().then((stream) => {
      setStreamingConfig({
        on: true,
        type: 'audio-video',
        stream,
      });
      setPermissionState('granted');
    })
    .catch(() => {
      setPermissionState('denied');
    })
  };

  useEffect(() => {
    showStream();
  }, []);

  useEffect(() => {
    props.onUpdated(streamingConfig);

    return () => {
      if (streamingConfig.on) {
        removeAVStream(streamingConfig.stream);
      }
    }
  }, [streamingConfig]);

  return (
    <div className={cls.container}>
      <FaceTime
        muted
        streamConfig={streamingConfig}
        streamingOffFallback={(
          <AspectRatio className={cls.noFacetime}>
            <Box fill justify="center" alignContent="center" align="center" pad="medium">
              {permissionState === 'pending' && (
                <Text textAlign="center">Waiting for Camera & Microphone Permissions...</Text>
              )}
              {permissionState === 'denied' && (
                <Text textAlign="center">Your Camera & Microphone permissions seem to be off. Please allow them in order to proceed.</Text>
              )}
            </Box>
          </AspectRatio>
        )}
      />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
  noFacetime: {
    background: '#ededed',
  },
});
