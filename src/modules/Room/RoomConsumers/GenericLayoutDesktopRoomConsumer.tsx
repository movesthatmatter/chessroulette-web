import React, { useMemo } from 'react';
import cx from 'classnames';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { effects, fonts, softBorderRadius } from 'src/theme';
import { RoomDetailsConsumer } from './RoomDetailsConsumer';
import { StreamingBoxRoomConsumer } from './StreamingBoxRoomConsumer';
import { RoomTabsWidgetRoomConsumer } from './RoomTabsWidgetRoomConsumer';
import { DesktopRoomLayout, LayoutContainerDimensions } from '../Layouts';
import { Logo } from 'src/components/Logo';
import { UserMenu } from 'src/components/Navigation';
import { getBoxShadow } from 'src/theme/util';
import { NavigationLink } from 'src/components/NavigationLink';
import { SwitchActivityWidgetRoomConsumer } from './SwitchActivityWidgetRoomConsumer';
import { RoomControlMenuConsumer } from './RoomControlMenuConsumer';
import { DarkModeSwitch } from 'src/components/DarkModeSwitch/DarkModeSwitch';
import { Button } from 'src/components/Button';
import { useRoomConsumer } from './useRoomConsumer';
import { Modal } from 'src/components/Modal/Modal';
import { MeetupLayer } from '../Layouts/Generic/components/MeetupLayer';

type Props = {
  renderActivity: (d: {
    isMobile: boolean;
    boardSize: number;
    leftSide: LayoutContainerDimensions;
    // TODO: might need a bunch of other dimensinos like the marging
    //  size or the bottom to inform the activity
  }) => React.ReactNode;
};

const TOP_HEIGHT = 90;
const BOTTOM_HEIGHT = 56;
const MIN_SPACE_BETWEEN = spacers.largePx;
const LAYOUT_RATIOS = {
  leftSide: 1.2,
  mainArea: 3,
  rightSide: 2.1,
};

const BATTLE_LAYOUT_RATIOS = {
  leftSide: 1.5,
  mainArea: 3,
  rightSide: 1.7,
};

// TODO: This isn't provided for now and don't think it needs to be but for now it sits here
export const GenericLayoutDesktopRoomConsumer: React.FC<Props> = React.memo((props) => {
  const cls = useStyles();
  const roomConsumer = useRoomConsumer();

  const layoutRatios = useMemo(() => {
    if (roomConsumer?.room.layout === 'battle') {
      return BATTLE_LAYOUT_RATIOS;
    }

    return LAYOUT_RATIOS;    
  }, [roomConsumer?.room.layout]);

  return (
    <div className={cls.container}>
      <DesktopRoomLayout
        ratios={layoutRatios}
        topHeight={TOP_HEIGHT}
        bottomHeight={BOTTOM_HEIGHT}
        minSpaceBetween={MIN_SPACE_BETWEEN}
        renderTopComponent={({ left, right, center }) => (
          <div className={cls.top}>
            <div className={cls.mainTop}>
              <div className={cls.logoWrapper} style={{ marginRight: '7%' }}>
                <Logo asLink withBeta />
              </div>
              <div className={cls.userMenuWrapper}>
                <div className={cls.linksContainer}>
                  <SwitchActivityWidgetRoomConsumer
                    render={({ onSwitch, goLive, toggleInMeetup, room }) => (
                      <>
                        <NavigationLink
                          title="Activities"
                          withDropMenu={{
                            items: [
                              {
                                title: 'Play',
                                disabled: room.currentActivity.type === 'play' || room.live,
                                onClick: () => onSwitch({ activityType: 'play' }),
                              },
                              {
                                title: 'Analyze',
                                disabled:
                                  (room.currentActivity.type === 'play' &&
                                    room.currentActivity.game?.state === 'started') ||
                                  room.currentActivity.type === 'analysis' ||
                                  room.live,
                                onClick: () => onSwitch({ activityType: 'analysis' }),
                              },
                            ],
                          }}
                        />
                        {room.currentActivity.type === 'play' &&
                          room.currentActivity.game &&
                          !room.live && (
                            <div
                              style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                marginLeft: spacers.default,
                              }}
                            >
                              <Button
                                label="Go Live"
                                type="primary"
                                clear
                                onClick={() => goLive()}
                                style={{ marginBottom: '0px' }}
                              />
                            </div>
                          )}

                        {room.currentActivity.type !== 'play' && (
                          <div
                            style={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              marginLeft: spacers.default,
                            }}
                          >
                            <Button
                              label="Meetup Mode"
                              type="primary"
                              clear
                              onClick={() => toggleInMeetup(true)}
                              style={{ marginBottom: '0px' }}
                            />
                          </div>
                        )}
                      </>
                    )}
                  />
                  {roomConsumer?.room.live && (
                    <div className={cls.liveContainer}>
                      <div className={cls.liveIcon} />
                      <div className={cls.liveText}>LIVE</div>
                    </div>
                  )}
                </div>
                <UserMenu reversed showPeerStatus />
              </div>
            </div>
            <div style={{ width: right.width }} />
          </div>
        )}
        renderRightSideComponent={({ container }) => (
          <div className={cx(cls.side, cls.rightSide)}>
            <div className={cls.rightSideTop} style={{ height: `${TOP_HEIGHT}px` }}>
              <div className={cls.roomInfoContainer}>
                <RoomDetailsConsumer />
                <div style={{ display: 'flex' }}>
                  <DarkModeSwitch />
                  <div style={{ width: spacers.large }} />
                  <RoomControlMenuConsumer />
                </div>
              </div>
            </div>
            <div className={cls.rightSideStretchedContainer}>
              {!roomConsumer?.room.inMeetup && roomConsumer?.room.p2pCommunicationType !== 'none' && (
                <div>
                  <StreamingBoxRoomConsumer containerClassName={cls.streamingBox} />
                </div>
              )}
              <RoomTabsWidgetRoomConsumer
                bottomContainerHeight={BOTTOM_HEIGHT + container.verticalPadding - 1}
              />
            </div>
          </div>
        )}
        renderBottomComponent={() => null}
        renderActivityComponent={(extendedDimensions) => (
          <div className={cls.activityContainer}>
            {props.renderActivity({
              isMobile: false,
              boardSize: extendedDimensions.center.width,
              leftSide: {
                ...extendedDimensions.left,
                width: extendedDimensions.left.width + extendedDimensions.main.horizontalPadding,
              },
            })}
          </div>
        )}
      />
      {roomConsumer?.room.inMeetup && (
        <Modal
          style={{
            height: '100%',
            width: '100%',
          }}
        >
          <MeetupLayer room={roomConsumer.room} />
        </Modal>
      )}
    </div>
  );
});

const useStyles = createUseStyles((theme) => ({
  container: {
    width: '100%',
    height: '100%',
    color: theme.text.baseColor,
    display: 'flex',
    flexDirection: 'column',
    background: theme.colors.background,
  },
  top: {
    display: 'flex',
    height: '100%',
    flex: 1,
  },
  mainTop: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
    paddingTop: spacers.default,
    paddingBottom: spacers.larger,
    paddingLeft: spacers.large,
    paddingRight: spacers.large,
  },
  userMenuWrapper: {
    display: 'flex',
    flex: 1,
    justifyContent:'flex-start'
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  side: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
  },
  rightSide: {
    background: theme.colors.white,
    boxShadow: getBoxShadow(0, 0, 26, 10, 'rgba(16, 30, 115, 0.08)'),
    paddingLeft: `${MIN_SPACE_BETWEEN}px`,
    paddingRight: `${MIN_SPACE_BETWEEN}px`,
  },
  rightSideTop: {
    display: 'flex',
  },
  roomInfoContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacers.small,
    paddingBottom: spacers.large,
  },
  rightSideStretchedContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
    alignItems: 'stretch',
    height: '100%',
  },
  streamingBox: {
    ...softBorderRadius,
    overflow: 'hidden',

    // Fix issue on Safari with Border Radiuses not working
    transform: 'translateZ(0)',
  },
  activityContainer: {
    position: 'relative',
    zIndex: 1,
  },
  linksContainer: {
    display: 'flex',
    alignItems: 'center',
    flex: 3,
  },
  liveContainer: {
    display: 'flex',
    marginLeft: spacers.default,
    backgroundColor: theme.depthBackground.backgroundColor,
    padding: '5px',
    ...effects.softBorderRadius,
  },
  liveIcon: {
    width: '12px',
    height: '12px',
    background: '#ff32a1',
    boxSizing: 'border-box',
    borderRadius: '50%',
    marginRight: spacers.small,
    alignSelf: 'center',
  },
  liveText: {
    color: theme.text.baseColor,
    ...fonts.small2,
  },
}));
