import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { MobileRoomLayout } from 'src/modules/Room/LayoutProvider/Layouts/Generic/RoomLayout/MobileRoomLayout';
import { StreamingBoxRoomConsumer } from './StreamingBoxRoomConsumer';
import { ContainerDimensions } from 'src/modules/Rooms/PlayRoom/Layouts/DesktopLayout/util';
import { useDeviceSize } from 'src/theme/hooks/useDeviceSize';

type Props = {
  renderTopOverlayHeader?: (d: {
    topAreaContainer: ContainerDimensions; // TODO: Unify all these under some group that makes ses (maybe layouts?)
    mainAreaContainer: ContainerDimensions; // TODO: Unify all these under some group that makes ses (maybe layouts?)
  }) => React.ReactNode;
  renderTopOverlayMain?: (d: {
    topAreaContainer: ContainerDimensions; // TODO: Unify all these under some group that makes ses (maybe layouts?)
    mainAreaContainer: ContainerDimensions; // TODO: Unify all these under some group that makes ses (maybe layouts?)
  }) => React.ReactNode;
  renderTopOverlayFooter?: (d: {
    topAreaContainer: ContainerDimensions; // TODO: Unify all these under some group that makes ses (maybe layouts?)
    mainAreaContainer: ContainerDimensions; // TODO: Unify all these under some group that makes ses (maybe layouts?)
  }) => React.ReactNode;
  renderActivity: (d: { isMobile: boolean; boardSize: number }) => React.ReactNode;
};

export const GenericLayoutMobileRoomConsumer: React.FC<Props> = ({
  renderTopOverlayFooter = () => null,
  renderTopOverlayHeader = () => null,
  renderTopOverlayMain = () => null,
  ...props
}) => {
  const cls = useStyles();
  const deviceSize = useDeviceSize();

  return (
    <MobileRoomLayout
      getTopArea={(dimensions) => (
        <StreamingBoxRoomConsumer
          aspectRatio={dimensions.container}
          headerOverlay={() =>
            renderTopOverlayHeader({
              topAreaContainer: dimensions.container,
              mainAreaContainer: dimensions.mainAreaContainer,
            })
          }
          mainOverlay={() => (
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
              }}
            >
              {renderTopOverlayMain({
                topAreaContainer: dimensions.container,
                mainAreaContainer: dimensions.mainAreaContainer,
              })}
            </div>
          )}
          footerOverlay={() =>
            renderTopOverlayFooter({
              topAreaContainer: dimensions.container,
              mainAreaContainer: dimensions.mainAreaContainer,
            })
          }
        />
      )}
      getMainArea={(cd) => (
        <div className={cls.mainContainer}>
          {props.renderActivity({
            isMobile: true,
            boardSize: cd.container.width - (deviceSize.isSmallMobile ? 60 : 24),
          })}
        </div>
      )}
    />
  );
};

const useStyles = createUseStyles({
  mainContainer: {
    paddingBottom: '8px',
  },
});
