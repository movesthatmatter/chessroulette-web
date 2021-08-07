import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import cx from 'classnames';
import { colors, softBorderRadius } from 'src/theme';
import { ExitRoomButton } from 'src/modules/Room/Room/components/ExitRoomButton';
import { NavigationHeader } from 'src/modules/Room/LayoutProvider/RoomLayoutProvider/components/NavigationHeader';
import { DesktopRoomLayout } from 'src/modules/Room/LayoutProvider/Layouts/Generic/RoomLayout/DesktopRoomLayout';
import { RoomDetailsConsumer } from './RoomDetailsConsumer';
import { StreamingBoxRoomConsumer } from './StreamingBoxRoomConsumer';
import { RoomTabsWidgetRoomConsumer } from './RoomTabsWidgetRoomConsumer';

type Props = {
  renderActivity: (d: {
    isMobile: boolean;
    // containerDimensions: LayoutContainerDimensions;
    boardSize: number;
    // TODO: might need a bunch of other dimensinos like the marging size or the bottom to inform the activity
  }) => React.ReactNode;
};

const TOP_HEIGHT = 66;
const BOTTOM_HEIGHT = 30;
const MIN_SPACE_BETWEEN = spacers.largePx;

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
        renderTopComponent={({ right }) => (
          <div className={cls.top}>
            <div className={cls.mainTop}>
              <NavigationHeader />
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
        renderActivityComponent={(extendedDimensions) =>
          props.renderActivity({
            isMobile: false,
            // containerDimensions: extendedDimensions.container,
            boardSize: extendedDimensions.center.width,
          })
        }
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
    // background: 'red',
    // fill direction="row" style={{ height: '100%' }}
  },
  mainTop: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
    paddingTop: spacers.default,
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
    // background: 'red',
    // height: '100%',
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
});
