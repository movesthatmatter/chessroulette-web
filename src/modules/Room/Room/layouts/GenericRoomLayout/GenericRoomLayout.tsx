import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Room } from 'src/providers/PeerProvider';
import { useDeviceSize } from 'src/theme/hooks/useDeviceSize';
import { spacers } from 'src/theme/spacers';
import { GenericDesktopLayout } from '../../components/Layouts/GenericLayout/GenericDesktopLayout';
import { GenericMobileLayout } from '../../components/Layouts/GenericLayout/GenericMobileLayout';
import { GenericLayoutExtendedDimensions } from '../../components/Layouts/GenericLayout/types';
import { LayoutContainerDimensions } from '../../components/Layouts/types';
import { NavigationHeader } from './components/NavigationHeader';
import cx from 'classnames';
import { colors, softBorderRadius } from 'src/theme';
import { RoomDetails } from '../../components/RoomDetails';
import { ExitRoomButton } from '../../components/ExitRoomButton';
import { StreamingBox } from 'src/components/StreamingBox';
import { RoomTabsWidget } from '../../widgets/RoomTabsWidget';

type Props = {
  room: Room;
  renderActivity: (d: {
    containerDimensions: LayoutContainerDimensions;
    // TODO: might need a bunch of other dimensinos like the marging size or the bottom to inform the activity
  }) => React.ReactNode;
};

const TOP_HEIGHT = 80;
const BOTTOM_HEIGHT = 80;
const MIN_SPACE_BETWEEN = spacers.largePx;

export const GenericRoomLayout: React.FC<Props> = (props) => {
  const deviceSize = useDeviceSize();
  const cls = useStyles();

  // if (deviceSize.isMobile) {
  //   return <GenericMobileLayout />
  // }

  return (
    <div className={cls.container}>
      <GenericDesktopLayout
        ratios={{
          leftSide: 1.2,
          gameArea: 3,
          rightSide: 2,
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
                <RoomDetails room={props.room} />
                <ExitRoomButton />
              </div>
            </div>
            <div className={cls.rightSideStretchedContainer}>
              <div>
                <StreamingBox
                  room={props.room}
                  // focusedPeerId={!!props.meAsPlayer ? props.opponentAsPlayer?.user.id : undefined}
                  containerClassName={cls.streamingBox}
                />
              </div>
              <RoomTabsWidget
                me={props.room.me.user}
                bottomContainerHeight={BOTTOM_HEIGHT + container.verticalPadding - 1}
              />
            </div>
          </div>
        )}
        renderBottomComponent={() => null}
        renderLeftSideComponent={() => null}
        // renderLeftSideComponent={({ container }) => (
        //   <div style={{ background: 'yellow', width: container.width, height: container.height }}>
        //     {/* asd */}
        //   </div>
        // )}
        renderActivityComponent={(extendedDimensions) =>
          props.renderActivity({ containerDimensions: extendedDimensions.container })
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
    paddingRight: spacers.get(2),
  },
  navigationHeaderContainer: {
    flex: 1,
  },
  userMenuContainer: {
    height: `${TOP_HEIGHT}px`,
    paddingRight: `${MIN_SPACE_BETWEEN}px`,
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
  },
});
