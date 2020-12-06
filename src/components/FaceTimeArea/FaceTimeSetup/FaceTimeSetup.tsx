import React, { useState, useEffect, useRef } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { PeerStreamingConfig } from 'src/services/peers';
import { AspectRatio } from 'src/components/AspectRatio';
import { Box } from 'grommet';
import { Text } from 'src/components/Text';
import { FaceTime } from '../FaceTime';
import { getAVStreaming } from 'src/services/AVStreaming';
import { colors, softBorderRadius } from 'src/theme';

type Props = {
  onUpdated: (streamingConfig: PeerStreamingConfig) => void;
};

export const FaceTimeSetup: React.FC<Props> = (props) => {
  const cls = useStyles();
  const AVStreaming = useRef(getAVStreaming()).current;

  const [streamingConfig, setStreamingConfig] = useState<PeerStreamingConfig>({ on: false });
  const [permissionState, setPermissionState] = useState<'none' | 'pending' | 'granted' | 'denied'>(
    'none'
  );

  const showStream = () => {
    setPermissionState('pending');

    AVStreaming
      .getStream()
      .then((stream) => {
        setStreamingConfig({
          on: true,
          type: 'audio-video',
          stream,
        });
        setPermissionState('granted');
      })
      .catch(() => {
        // TODO: Check wether this was actually the case.
        // b/c there's a chance it might've falled due to an actual error
        setPermissionState('denied');
      });
  };

  useEffect(() => {
    showStream();
  }, []);

  useEffect(() => {
    props.onUpdated(streamingConfig);

    return () => {
      if (streamingConfig.on) {
        AVStreaming.destroyStreamById(streamingConfig.stream.id);
      }
    };
  }, [streamingConfig]);

  return (
    <div className={cls.container}>
      <FaceTime
        muted
        streamConfig={streamingConfig}
        className={cls.facetime}
        streamingOffFallback={
          <AspectRatio
            className={cls.noFacetime}
            aspectRatio={{
              width: 4,
              height: 3,
            }}
          >
            <Box
              fill
              justify="center"
              alignContent="center"
              align="center"
              pad="medium"
              style={{
                textAlign: 'center',
              }}
            >
              {permissionState === 'pending' && (
                <Text size="small1">
                  Waiting for Camera & Microphone Permissions...
                </Text>
              )}
              {permissionState === 'denied' && (
                <Text size="small1">
                  Your Camera & Microphone permissions seem to be off. Please allow them in order to
                  proceed.
                </Text>
              )}
            </Box>
          </AspectRatio>
        }
      />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    ...softBorderRadius,
    overflow: 'hidden',
  },
  noFacetime: {
    background: colors.neutral,
  },
  facetime: {
    ...softBorderRadius,
    overflow: 'hidden',
  },
});
