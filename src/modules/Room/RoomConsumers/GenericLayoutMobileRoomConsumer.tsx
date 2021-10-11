import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { StreamingBoxRoomConsumer } from './StreamingBoxRoomConsumer';
import { useDeviceSize } from 'src/theme/hooks/useDeviceSize';
import { MobileRoomLayout, NavigationHeader } from '../Layouts';
import { ContainerDimensions } from '../Layouts/Generic/DesktopRoomLayout/util';

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


// TODO: This isn't provided for now and don't think it needs to be but for now it sits here
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
          isMobile
          aspectRatio={dimensions.container}
          headerOverlay={() => <NavigationHeader darkBG />}
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
          // Account for the rounded border
          footerOverlay={() => <div style={{ height: '16px' }} />}
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
