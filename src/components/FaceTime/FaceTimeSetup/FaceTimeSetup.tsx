import React, { useState, useEffect } from 'react';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import {
  PeerStreamingConfig,
  PeerStreamingConfigOff,
  PeerStreamingConfigOn,
} from 'src/services/peers';
import { AspectRatio } from 'src/components/AspectRatio';
import { Text } from 'src/components/Text';
import { FaceTime } from '../FaceTime';
import { AVStreaming, getAVStreaming } from 'src/services/AVStreaming';
import { CustomTheme, softBorderRadius } from 'src/theme';
import useInstance from '@use-it/instance';
import { seconds } from 'src/lib/time';
import Loader from 'react-loaders';

type Props = {
  onUpdated: (p: { streamingConfig: PeerStreamingConfig; isLoading: boolean }) => void;
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
    return () => {
      if (streamingConfig.on) {
        // This is important as destroying it right away would
        //  create a need to reask for userMedia which on some browsers
        //  will retrigger the permissions!
        AVStreaming.destroyStreamByIdWithDelay(streamingConfig.stream.id, seconds(3));
      }
    };
  }, [streamingConfig.on]);

  useEffect(() => {
    props.onUpdated({ streamingConfig, isLoading: permissionState === 'pending' });
  }, [streamingConfig, permissionState]);

  // Show the stream on mount
  useEffect(showStream, []);

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
            <div className={cls.fallbackWrapper}>
              {permissionState === 'pending' && (
                <>
                  <Loader type="line-scale-pulse-out" active innerClassName={cls.loader} />
                  <Text size="small1" className={cls.pendingFallbackText}>
                    Waiting for Camera & Microphone Permissions...
                  </Text>
                </>
              )}
              {permissionState === 'denied' && (
                <Text size="small1">
                  Your Camera & Microphone permissions seem to be off. Please use your Browser's
                  settings to allow them.
                </Text>
              )}
            </div>
          </AspectRatio>
        }
      />
    </div>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    ...softBorderRadius,
    overflow: 'hidden',
  },
  noFacetime: {
    background: theme.name === 'lightDefault' ? theme.colors.neutral : theme.colors.neutralLight,
  },
  facetime: {
    ...softBorderRadius,
    overflow: 'hidden',
  },
  loader: {
    transform: 'scale(.7)',
    ...({
      '& > div': {
        backgroundColor: theme.colors.primary,
      },
    } as CSSProperties),
  },
  fallbackWrapper: {
    display: 'flex',
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    justifyItems: 'center',
  },
  pendingFallbackText: {
    paddingBottom: '2em',
  },
}));
