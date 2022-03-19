import React from 'react';
import cx from 'classnames';
import { createUseStyles } from 'src/lib/jss';
import { Peer, PeerInfo, StreamingPeer } from 'src/providers/PeerProvider';
import { FaceTime } from '../FaceTime';
import { hideOnDesktop, onlyMobile, softBorderRadius } from 'src/theme';
import { MyFaceTime } from '../MyFaceTime';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { spacers } from 'src/theme/spacers';
import { AspectRatioProps } from 'src/components/AspectRatio';

type Props = {
  me: Peer;
  streamingPeers: StreamingPeer[];
  onClick: (userId: StreamingPeer['user']['id']) => void;

  itemAspectRatio?: AspectRatioProps['aspectRatio'];
  containerClassName?: string;
  itemClassName?: string;

  mirrorMyFaceTime?: boolean;
};

const TRANSITION_TIME = 100;

export const MultiFaceTimeGrid: React.FC<Props> = ({
  itemAspectRatio = 4 / 3,
  me,
  mirrorMyFaceTime,
  ...props
}) => {
  const cls = useStyles();

  return (
    <div className={cx(cls.container, props.containerClassName)}>
      <div className={cx(cls.smallFacetimeWrapper, props.itemClassName)}>
        <MyFaceTime
          className={cls.smallFacetime}
          aspectRatio={itemAspectRatio}
          mirrorImage={mirrorMyFaceTime}
          headerOverlay={
            <div className={cls.header}>
              <div style={{ flex: 1, ...hideOnDesktop }} />
              <div className={cls.peerInfoWrapper}>
                <PeerInfo darkBG reversed peerUserInfo={me.user} showPeerStatus={false} />
              </div>
            </div>
          }
        />
        <div className={cls.smallFacetimeBorder} />
      </div>
      {props.streamingPeers.map((peer, i) => (
        <SwitchTransition mode="out-in" key={i}>
          <CSSTransition
            key={peer.user.id}
            timeout={TRANSITION_TIME}
            classNames={{
              enter: cls.itemEnter,
              enterActive: cls.itemEnterActive,
              enterDone: cls.itemEnterDone,
              exit: cls.itemExit,
            }}
          >
            <div
              className={cx(cls.smallFacetimeWrapper, cls.faceTimeAsButton, props.itemClassName)}
              onClick={() => props.onClick(peer.user.id)}
            >
              <FaceTime
                streamConfig={peer.connection.channels.streaming}
                className={cls.smallFacetime}
                aspectRatio={itemAspectRatio}
                // label={getUserDisplayName(peer.user)}
                // labelClassName={cls.smallFacetimeLabel}
                headerOverlay={
                  <div className={cls.header}>
                    <div style={{ flex: 1, ...hideOnDesktop }} />
                    <div className={cls.peerInfoWrapper}>
                      <PeerInfo darkBG reversed peerUserInfo={peer.user} showPeerStatus={false} />
                    </div>
                  </div>
                }
              />
              <div className={cls.smallFacetimeBorder} />
            </div>
          </CSSTransition>
        </SwitchTransition>
      ))}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
  faceTimeAsButton: {
    cursor: 'pointer',
  },
  smallFacetimeWrapper: {
    ...softBorderRadius,
    marginTop: '8%',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 9,
  },
  smallFacetime: {
    position: 'relative',
    zIndex: 8,
  },
  smallFacetimeBorder: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    border: '1px solid white',
    ...softBorderRadius,
  },
  smallFacetimeLabel: {
    // ...fonts,
  },
  itemEnter: {
    transform: 'scale(.5)',
  },
  itemEnterActive: {
    transform: 'scale(1)',
  },
  itemEnterDone: {},
  itemExit: {
    transform: 'scale(.5)',
    opacity: 0,
    transitionDuration: `${TRANSITION_TIME}ms`,
  },

  logoStreamingBox: {
    padding: spacers.get(0.7),
    marginTop: '-5px',
    width: '48px',
  },
  header: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    zIndex: 999,
  },
  peerInfoWrapper: {
    ...onlyMobile({
      flexDirection: 'column',
      justifyContent: 'flex-end',
    }),
    flex: 1,
    display: 'flex',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    padding: spacers.default,
  },
});
