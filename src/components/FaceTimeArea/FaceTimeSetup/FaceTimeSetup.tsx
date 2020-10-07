import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { PeerStreamingConfig } from 'src/services/peers';
import { AspectRatio } from 'src/components/AspectRatio';
import { Button } from 'src/components/Button';
import { noop } from 'src/lib/util';
import { Box } from 'grommet';
import { Video } from 'grommet-icons';
import { FaceTime } from '../FaceTime';

type Props = {
  onUpdated: (streamingConfig: PeerStreamingConfig) => void;
};

// This component should be connected with the Global User state and
//  read the streamingConfig from there. Also update it there only
//  so there's only one state!
export const FaceTimeSetup: React.FC<Props> = (props) => {
  const cls = useStyles();

  const [streamingConfig, setStreamingConfig] = useState<PeerStreamingConfig>({ on: false });

  const showStream = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStreamingConfig({
          on: true,
          type: 'audio-video',
          stream,
        });
      });
  };

  useEffect(() => {
    props.onUpdated(streamingConfig);
  }, [streamingConfig]);

  return (
    <div className={cls.container}>
      <FaceTime
        muted
        streamConfig={streamingConfig}
        streamingOffFallback={(
          <AspectRatio className={cls.noFacetime}>
            <Box fill justify="center">
              <Button
                onClick={showStream}
                alignSelf="center"
                // primary
                // hoverIndicator
                icon={<Video />}
                primary
                label="Start Camera"
              />
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
