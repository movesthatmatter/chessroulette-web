import React, { useEffect, useRef, useState } from 'react';
import { IconButton } from 'src/components/Button';
import { createUseStyles } from 'src/lib/jss';
import { faVideoSlash, faVolumeMute, faVideo, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { noop } from 'src/lib/util';
import { spacers } from 'src/theme/spacers';
import { switchAudio, switchVideo } from 'src/modules/Rooms/GenericRoom/GenericRoomBouncer/reducer';
import { useDispatch, useSelector } from 'react-redux';
import { selectMediaStatus } from 'src/modules/Rooms/GenericRoom/GenericRoomBouncer/selectors';
import { AVStreaming, getAVStreaming } from 'src/services/AVStreaming';
import useInstance from '@use-it/instance';

type Props = {};
type MediaStatus = {
  video: boolean;
  audio: boolean;
};

export const StreamingFooterOverlay: React.FC<Props> = (props) => {
  const cls = useStyles();
  const mediaStatus = useSelector(selectMediaStatus);
  const dispatch = useDispatch();

  const avStreaming = useInstance<AVStreaming>(getAVStreaming);

  useEffect(() => {
    if (!mediaStatus) {
      return;
    }

    avStreaming.updateAllStreams(mediaStatus);
  }, [avStreaming, mediaStatus])

  const [audioVideoStatus, setAudioVideoStatus] = useState<MediaStatus>({
    audio: mediaStatus ? mediaStatus.audio : false,
    video: mediaStatus ? mediaStatus.video : false,
  });
  useEffect(() => {
    if (mediaStatus) {
      setAudioVideoStatus({
        audio: mediaStatus.audio,
        video: mediaStatus.video,
      });
    }
  }, [mediaStatus]);
  return (
    <div className={cls.footerOverlayContainer}>
      <IconButton
        icon={() => (
          <FontAwesomeIcon icon={audioVideoStatus.video ? faVideo : faVideoSlash} size="xs" />
        )}
        onSubmit={() => {
          dispatch(switchVideo());
        }}
        className={cls.iconButton}
      />
      <div style={{ width: spacers.smallestPxPx }} />
      <IconButton
        icon={() => (
          <FontAwesomeIcon icon={audioVideoStatus.audio ? faVolumeUp : faVolumeMute} size="xs" />
        )}
        onSubmit={() => {
          dispatch(switchAudio());
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
