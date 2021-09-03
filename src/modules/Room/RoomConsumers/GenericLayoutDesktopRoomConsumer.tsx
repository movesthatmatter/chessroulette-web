import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import cx from 'classnames';
import { colors, softBorderRadius } from 'src/theme';
import { RoomDetailsConsumer } from './RoomDetailsConsumer';
import { StreamingBoxRoomConsumer } from './StreamingBoxRoomConsumer';
import { RoomTabsWidgetRoomConsumer } from './RoomTabsWidgetRoomConsumer';
import {
  DesktopRoomLayout,
  ExitRoomButton,
  LayoutContainerDimensions,
} from '../Layouts';
import { Logo } from 'src/components/Logo';
import { UserMenu } from 'src/components/Navigation';
import { SwitchActivityRoomConsumer } from './SwitchActivityRoomConsumer';
import { getBoxShadow } from 'src/theme/util';

type Props = {
  renderActivity: (d: {
    isMobile: boolean;
    // containerDimensions: LayoutContainerDimensions;
    boardSize: number;
    leftSide: LayoutContainerDimensions;
    // TODO: might need a bunch of other dimensinos like the marging size or the bottom to inform the activity
  }) => React.ReactNode;
};

const TOP_HEIGHT = 66;
const BOTTOM_HEIGHT = 30;
const MIN_SPACE_BETWEEN = spacers.largePx;

// TODO: This isn't provided for now and don't think it needs to be but for now it sits here
export const GenericLayoutDesktopRoomConsumer: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <DesktopRoomLayout
        ratios={{
          leftSide: 1.2,
          mainArea: 3,
          rightSide: 2.1,
        }}
        topHeight={TOP_HEIGHT}
        bottomHeight={BOTTOM_HEIGHT}
        minSpaceBetween={MIN_SPACE_BETWEEN}
        renderTopComponent={({ left, right }) => (
          <div className={cls.top}>
            <div className={cls.mainTop}>
              <div style={{ width: left.width }}>
                <Logo asLink />
              </div>
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                }}
              >
                <SwitchActivityRoomConsumer type="analysis" text="Analysis" />
                <SwitchActivityRoomConsumer type="play" text="Play" />
                <SwitchActivityRoomConsumer type="none" text="none" />
                <UserMenu reversed />
              </div>
              {/* <NavigationHeader /> */}
            </div>
            <div style={{ width: right.width }} />
          </div>
        )}
        renderRightSideComponent={({ container }) => (
          <div className={cx(cls.side, cls.rightSide)}>
            <div style={{ height: `${TOP_HEIGHT}px` }}>
              <div className={cls.roomInfoContainer}>
                <RoomDetailsConsumer />
                <ExitRoomButton />
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
              leftSide: extendedDimensions.left,
            })}
          </div>
        )}
      />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    width: '100%',
    height: '100%',

    display: 'flex',
    flexDirection: 'column',
    background: colors.background,
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
    paddingTop: spacers.smaller,
    paddingBottom: spacers.large,
    paddingLeft: spacers.default,
    paddingRight: spacers.large,
  },
  side: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
  },
  rightSide: {
    background: colors.white,
    boxShadow: getBoxShadow(0, 0, 26, 10, 'rgba(16, 30, 115, 0.08)'),
    paddingLeft: `${MIN_SPACE_BETWEEN}px`,
    paddingRight: `${MIN_SPACE_BETWEEN}px`,
  },
  roomInfoContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacers.default,
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
    // background: 'red',
    position: 'relative',
    zIndex: 1,
  },
});
