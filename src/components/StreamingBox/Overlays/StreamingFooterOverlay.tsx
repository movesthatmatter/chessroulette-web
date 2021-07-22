import React, { useEffect, useState } from 'react';
import { IconButton } from 'src/components/Button';
import { createUseStyles } from 'src/lib/jss';
import { faVideoSlash, faVolumeMute, faVideo, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { spacers } from 'src/theme/spacers';
import { AVStreaming, getAVStreaming } from 'src/services/AVStreaming';
import useInstance from '@use-it/instance';

type Props = {};

export const StreamingFooterOverlay: React.FC<Props> = () => {
  const cls = useStyles();
  const avStreaming = useInstance<AVStreaming>(getAVStreaming);
  const [activeConstraints, setACtiveConstraints] = useState(avStreaming.activeConstraints);

  useEffect(() => {
    avStreaming.onUpdateConstraints((nextConstraints) => {
      setACtiveConstraints(nextConstraints);

      // TODO: Update Redux
      //  We need to store the chosen constraints in the session (in Redux)
      //  so on refresh it keeps them

      // TODO: This one not yet!
      //  Another we need to do is, to select the constraaints at Challenge Accept
      //  so those constraints will be saved globally (in the AVStreaming and )
    });
  }, [avStreaming]);

  return (
    <div className={cls.footerOverlayContainer}>
      <IconButton
        icon={() => (
          <FontAwesomeIcon icon={activeConstraints.video ? faVideo : faVideoSlash} size="xs" />
        )}
        onSubmit={() => {
          avStreaming.updateConstraints({
            ...avStreaming.activeConstraints,
            video: !avStreaming.activeConstraints.video,
          });
        }}
        className={cls.iconButton}
      />
      <div style={{ width: spacers.smallestPxPx }} />
      <IconButton
        icon={() => (
          <FontAwesomeIcon icon={activeConstraints.audio ? faVolumeUp : faVolumeMute} size="xs" />
        )}
        onSubmit={() => {
          avStreaming.updateConstraints({
            ...avStreaming.activeConstraints,
            audio: !avStreaming.activeConstraints.audio,
          });
        }}
        className={cls.iconButton}
      />
    </div>
  );
};

const useStyles = createUseStyles({
  footerOverlayContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: spacers.smallest,
    marginBottom: spacers.smallest,
  },
  iconButton: {
    marginBottom: '0px',
    height: '20px',
    width: '20px',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
