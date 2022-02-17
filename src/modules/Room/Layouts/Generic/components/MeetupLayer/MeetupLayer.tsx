import React from 'react';
import { Button } from 'src/components/Button';
import { MyFaceTime } from 'src/components/FaceTime';
import { useStreamingReel } from 'src/components/StreamingBox/hooks/useStreamingReel';
import { Reel } from 'src/components/StreamingBox/MultiStreamingBox/components/Reel/Reel';
import { createUseStyles } from 'src/lib/jss';
import { SwitchActivityWidgetRoomConsumer } from 'src/modules/Room/RoomConsumers/SwitchActivityWidgetRoomConsumer';
import { Room } from 'src/providers/PeerProvider';
import { spacers } from 'src/theme/spacers';

type Props = {
  room: Room;
};

export const MeetupLayer: React.FC<Props> = (props) => {
  const cls = useStyles();
  const { state: reelState, onFocus } = useStreamingReel({ peers: props.room.peers });

  return (
    <div className={cls.container}>
      {/* <div className={cls.facetimeWrapper}>
        <MyFaceTime
          aspectRatio={4 / 3}
          // headerOverlay={
          //   props.headerOverlay ? props.headerOverlay({ inFocus: props.room.me.user }) : null
          // }
          // mainOverlay={props.mainOverlay ? props.mainOverlay({ inFocus: props.room.me.user }) : null}
          // footerOverlay={
          //   props.footerOverlay ? props.footerOverlay({ inFocus: props.room.me.user }) : null
          // }
        />
      </div> */}
      <div className={cls.reelWrapper}>
        {reelState.ready ? (
          <>
            {reelState.reel.map((s) => s.user.id)}
            <Reel
              reel={[reelState.inFocus, ...reelState.reel]}
              onClick={() => {}}
              containerClassName={cls.reel}
              itemClassName={cls.reelItem}
            />
          </>
        ) : (
          <div className={cls.reel}>
            <div className={cls.reelItem}>
              <MyFaceTime aspectRatio={{ width: 4, height: 3 }} />
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          top: '1em',
          right: '1em',
        }}
      >
        <SwitchActivityWidgetRoomConsumer
          render={({ toggleInMeetup }) => (
            <>
              <Button
                label="Close"
                clear
                onClick={() => toggleInMeetup(false)}
                // style={{ marginBottom: '0px' }}
              />
            </>
          )}
        />
      </div>
      {/* {props.room.pe.map((peer, i) => {
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
                  label={getUserDisplayName(peer.user)}
                  labelClassName={cls.smallFacetimeLabel}
                />
                <div className={cls.smallFacetimeBorder} />
              </div>
            </CSSTransition>
          </SwitchTransition>
        );
      })} */}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    // display: 'flex',
    // flex: 1,
    // backgroundColor: 'rgba(255, 0, 0, .1)',
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  facetimeWrapper: {
    width: '50%',
  },
  reelWrapper: {
    // display: 'flex',
    // flex: 1,
    width: '100%',
    padding: spacers.large,
    // backgroundColor: 'red',
    // height: '300px',
    // overflow: 'auto',
  },
  reel: {
    display: 'flex',
    flexDirection: 'row',
    // backgroundColor: 'violet',
  },
  reelItem: {
    // backgroundColor: 'violet',
    width: '100%',
    marginLeft: '1em',
    marginRight: '1em',
    marginTop: 0,
  },
});
