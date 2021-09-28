import React, { useEffect } from 'react';
import { IconButton } from 'src/components/Button';
import { createUseStyles } from 'src/lib/jss';
import { faVideoSlash, faVolumeMute, faVideo, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { spacers } from 'src/theme/spacers';
import { AVStreaming, getAVStreaming } from 'src/services/AVStreaming';
import useInstance from '@use-it/instance';
import { useDispatch } from 'react-redux';
import { updateAVConstraints } from './redux/actions';
import { useMediaStatus } from './useMediaStatus';
import { onlyDesktop, onlyMobile } from 'src/theme';

type Props = {};

export const AVStreamingControls: React.FC<Props> = () => {
  const cls = useStyles();
  const avStreaming = useInstance<AVStreaming>(getAVStreaming);
  const mediaStatus = useMediaStatus();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   avStreaming.updateConstraints({
  //     ...mediaStatus
  //   })
  // },[mediaStatus])

  // return (
  //   <div className={cls.footerOverlayContainer}>
  //     <IconButton
  //       icon={() => (
  //         <FontAwesomeIcon icon={mediaStatus.video ? faVideo : faVideoSlash} size="xs" />
  //       )}
  //       onSubmit={() => {
  //         dispatch(updateAVConstraints({
  //           ...mediaStatus,
  //           video: !mediaStatus.video
  //         }))
  //       }}
  //       className={cls.iconButton}
  //     />
  //     <div style={{ width: spacers.smallestPxPx }} />
  //     <IconButton
  //       icon={() => (
  //         <FontAwesomeIcon icon={mediaStatus.audio ? faVolumeUp : faVolumeMute} size="xs" />
  //       )}
  //       onSubmit={() => {
  //         dispatch(updateAVConstraints({
  //           ...mediaStatus,
  //           audio: !mediaStatus.audio
  //         }))
  //       }}
  //       className={cls.iconButton}
  //     />
  //   </div>
  // );

  // UPDATE Mon Sep 13th while removing the old Room Bouncer
  return null;
};

const useStyles = createUseStyles({
  footerOverlayContainer: {
    display: 'flex',
    flexDirection: 'row',
    ...onlyDesktop({
      justifyContent: 'flex-start',
      marginLeft: spacers.smallest,
      marginBottom: spacers.smallest,
    }),
    ...onlyMobile({
      justifyContent: 'flex-end',
      marginRight: spacers.default,
      marginBottom: spacers.default,
    })
  },
  iconButton: {
    marginBottom: '0px',
    height: '20px',
    width: '20px',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
