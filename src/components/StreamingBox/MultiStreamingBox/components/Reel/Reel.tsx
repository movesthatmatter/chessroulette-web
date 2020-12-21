import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import cx from 'classnames';
import { fonts, softBorderRadius } from 'src/theme';
import { FaceTime, MyFaceTime } from 'src/components/FaceTime';
import { Streamer } from '../../../types';

type Props = {
  reel: Streamer[];

  onClick: (userId: Streamer['user']['id']) => void;
};

const TRANSITION_TIME = 100;

export const Reel: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      {props.reel.map((peer, i) => {
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
                className={cx(cls.smallFacetimeWrapper, cls.faceTimeAsButton)}
                onClick={() => props.onClick(peer.user.id)}
              >
                <FaceTime
                  streamConfig={peer.streamingConfig}
                  className={cls.smallFacetime}
                  aspectRatio={{ width: 4, height: 3 }}
                  label={peer.user.name}
                  labelClassName={cls.smallFacetimeLabel}
                />
                <div className={cls.smallFacetimeBorder} />
              </div>
            </CSSTransition>
          </SwitchTransition>
        );
      })}
      <div className={cls.smallFacetimeWrapper}>
        <MyFaceTime
          className={cls.smallFacetime}
          aspectRatio={{ width: 4, height: 3 }}
        />
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
    zIndex: 997,
  },
  smallFacetime: {
    position: 'relative',
    zIndex: 998,
  },
  smallFacetimeBorder: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
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
