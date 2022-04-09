import React from 'react';
import cx from 'classnames';
import { createUseStyles } from 'src/lib/jss';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { fonts, softBorderRadius } from 'src/theme';
import { FaceTime, MyFaceTime } from 'src/components/FaceTime';
import { getUserDisplayName } from 'src/modules/User';
import { StreamingPeer } from 'src/providers/PeerConnectionProvider';

type Props = {
  streamingPeers: StreamingPeer[];
  onClick: (userId: StreamingPeer['user']['id']) => void;

  containerClassName?: string;
  itemClassName?: string;
};

const TRANSITION_TIME = 100;

export const Reel: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cx(cls.container, props.containerClassName)}>
      {props.streamingPeers.map((peer, i) => {
        return (
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
                  aspectRatio={{ width: 4, height: 3 }}
                  label={getUserDisplayName(peer.user)}
                  labelClassName={cls.smallFacetimeLabel}
                />
                <div className={cls.smallFacetimeBorder} />
              </div>
            </CSSTransition>
          </SwitchTransition>
        );
      })}
      <div className={cx(cls.smallFacetimeWrapper, props.itemClassName)}>
        <MyFaceTime className={cls.smallFacetime} aspectRatio={{ width: 4, height: 3 }} />
        <div className={cls.smallFacetimeBorder} />
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
  faceTimeAsButton: {
    cursor: 'pointer',
  },
  smallFacetimeWrapper: {
    marginTop: '8%',
    ...softBorderRadius,
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
    ...fonts.small3,
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
});
