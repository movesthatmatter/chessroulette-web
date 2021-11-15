import React from 'react';
import cx from 'classnames';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { softBorderRadius } from 'src/theme';
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

// TODO: This isn't provided for now and don't think it needs to be but for now it sits here
export const GenericLayoutDesktopRoomConsumer: React.FC<Props> = React.memo((props) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <DesktopRoomLayout
        ratios={LAYOUT_RATIOS}
        topHeight={TOP_HEIGHT}
        bottomHeight={BOTTOM_HEIGHT}
        minSpaceBetween={MIN_SPACE_BETWEEN}
        renderTopComponent={({ left, right, center }) => (
          <div className={cls.top}>
            <div className={cls.mainTop}>
              <div className={cls.logoWrapper} style={{ flex: 1, marginRight: '10px' }}>
                <Logo asLink withBeta />
              </div>
              <div className={cls.userMenuWrapper} style={{ minWidth: center.width }}>
                <div className={cls.linksContainer}>
                  <SwitchActivityWidgetRoomConsumer
                    render={({ onSwitch, room }) => (
                      <>
                        <NavigationLink
                          title="Activities"
                          withDropMenu={{
                            items: [
                              {
                                title: 'Play',
                                disabled: room.currentActivity.type === 'play',
                                onClick: () => onSwitch({ activityType: 'play' }),
                              },
                              {
                                title: 'Analyze',
                                disabled:
                                  (room.currentActivity.type === 'play' &&
                                    room.currentActivity.game?.state === 'started') ||
                                  room.currentActivity.type === 'analysis',
                                onClick: () => onSwitch({ activityType: 'analysis' }),
                              },
                            ],
                          }}
                        />
                        {room.currentActivity.type === 'play' && room.currentActivity.game && (
                          <Button
                            label="Go Live"
                            type="primary"
                            onClick={() => onSwitch({ activityType: 'relay'})}
                          />
                        )}
                      </>
                    )}
                  />
                </div>
                <div style={{ width: '20px' }} />
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
                <div
                  style={{
                    display: 'flex',
                  }}
                >
                  <DarkModeSwitch />
                  <div style={{ width: spacers.large }} />
                  <RoomControlMenuConsumer />
                </div>
              </div>
            </div>
            <div className={cls.rightSideStretchedContainer}>
              <div>
                <StreamingBoxRoomConsumer containerClassName={cls.streamingBox} />
              </div>
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
}));
