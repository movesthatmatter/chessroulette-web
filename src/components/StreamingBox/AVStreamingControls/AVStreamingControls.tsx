import React, { useEffect, useState } from 'react';
import { IconButton } from 'src/components/Button';
import { createUseStyles } from 'src/lib/jss';
import { faVideoSlash, faVolumeMute, faVideo, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { spacers } from 'src/theme/spacers';
import { AVStreaming, getAVStreaming } from 'src/services/AVStreaming';
import useInstance from '@use-it/instance';
import { useDispatch, useSelector } from 'react-redux';
import { selectMediaStatus } from './redux/selectors';
import { updateAVConstraints } from './redux/actions';

type Props = {};

export const AVStreamingControls: React.FC<Props> = () => {
  const cls = useStyles();
  const avStreaming = useInstance<AVStreaming>(getAVStreaming);
  const mediaStatus = useSelector(selectMediaStatus);
  //const [activeConstraints, setACtiveConstraints] = useState(avStreaming.activeConstraints);
  const dispatch = useDispatch();

  useEffect(() => {
    avStreaming.onUpdateConstraints((nextConstraints) => {
      dispatch(updateAVConstraints(nextConstraints));

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
          <FontAwesomeIcon icon={mediaStatus.video ? faVideo : faVideoSlash} size="xs" />
        )}
        onSubmit={() => {
          avStreaming.updateConstraints({
            ...avStreaming.activeConstraints,
            video: !mediaStatus.video,
          });
        }}
        className={cls.iconButton}
      />
      <div style={{ width: spacers.smallestPxPx }} />
      <IconButton
        icon={() => (
          <FontAwesomeIcon icon={mediaStatus.audio ? faVolumeUp : faVolumeMute} size="xs" />
        )}
        onSubmit={() => {
          avStreaming.updateConstraints({
            ...avStreaming.activeConstraints,
            audio: !mediaStatus.audio,
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
