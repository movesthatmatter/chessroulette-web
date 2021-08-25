import React, { useState, useEffect } from 'react';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { PeerStreamingConfig } from 'src/services/peers';
import { AspectRatio } from 'src/components/AspectRatio';
import { Box } from 'grommet';
import { Text } from 'src/components/Text';
import { FaceTime } from '../FaceTime';
import { AVStreaming, getAVStreaming } from 'src/services/AVStreaming';
import { colors, softBorderRadius } from 'src/theme';
import useInstance from '@use-it/instance';
import { seconds } from 'src/lib/time';
import Loader from 'react-loaders';

type Props = {
  onUpdated: (streamingConfig: PeerStreamingConfig) => void;
};

export const FaceTimeSetup: React.FC<Props> = (props) => {
  const cls = useStyles();
  const AVStreaming = useInstance<AVStreaming>(getAVStreaming);

  const [streamingConfig, setStreamingConfig] = useState<PeerStreamingConfig>({ on: false });
  const [permissionState, setPermissionState] = useState<'none' | 'pending' | 'granted' | 'denied'>(
    'none'
  );

  const showStream = () => {
    setPermissionState('pending');

    AVStreaming.getStream()
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
        // This is important as destroying it right away would
        //  create a need to reask for userMedia which on some browsers
        //  will retrigger the permissions!
        AVStreaming.destroyStreamByIdWithDelay(streamingConfig.stream.id, seconds(3));
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
                <>
                  <Loader type="line-scale-pulse-out" active innerClassName={cls.loader}/>
                  <Text size="small1">Waiting for Camera & Microphone Permissions...</Text>
                </>
              )}
              {permissionState === 'denied' && (
                <Text size="small1">
                  Your Camera & Microphone permissions seem to be off. Please use your Browser's
                  settings to allow them.
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
  loader: {
    transform: 'scale(.7)',
    ...{
      '& > div': {
        backgroundColor: colors.primary,
      },
    } as CSSProperties,
  },
});
