import React, { useRef } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { useContainerDimensions } from 'src/components/ContainerWithDimensions';
import Div100vh from 'react-div-100vh';
import { CustomTheme } from 'src/theme';

type Dimensions = {
  width: number;
  height: number;
};

type Props = {
  getTopArea: (d: { container: Dimensions; mainAreaContainer: Dimensions }) => React.ReactNode;
  getMainArea: (d: { container: Dimensions; topAreaContainer: Dimensions }) => React.ReactNode;
};

export const MobileRoomLayout: React.FC<Props> = (props) => {
  const cls = useStyles();

  const containerRef = useRef<HTMLDivElement>(null);
  const containerDimensions = useContainerDimensions(containerRef);

  const topContainerRef = useRef<HTMLDivElement>(null);
  const topContainerDimensions = useContainerDimensions(topContainerRef);

  const dimensions = {
    mainArea: {
      width: containerDimensions.width,
      height: containerDimensions.height - topContainerDimensions.height,
    },
    topArea: {
      width: topContainerDimensions.width,
      height: topContainerDimensions.height,
    },
  };

  return (
    <Div100vh className={cls.container}>
      <div className={cls.mainWrapper}>
        <div className={cls.main} ref={containerRef}>
          <div className={cls.topContainer} ref={topContainerRef}>
            {props.getTopArea({
              container: dimensions.topArea,
              mainAreaContainer: dimensions.mainArea,
            })}
          </div>
          <div className={cls.mainContainer}>
            {props.getMainArea({
              container: dimensions.mainArea,
              topAreaContainer: dimensions.topArea,
            })}
          </div>
        </div>
      </div>
    </Div100vh>
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  container: {
    height: '100vh',
    width: '100vw',
    position: 'fixed',
  },
  mainWrapper: {
    height: 'calc(100% - env(safe-area-inset-bottom, 8px))',

    paddingTop: 'env(safe-area-inset-top, 0)',
    paddingLeft: 'env(safe-area-inset-left, 0)',
    paddingRight: 'env(safe-area-inset-right, 0)',
    paddingBottom: 'env(safe-area-inset-bottom, 8px)',
  },
  main: {
    width: '100%',
    height: '100%',

    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  topContainer: {
    position: 'relative',
    overflow: 'hidden',
    flexGrow: 1,
  },
  mainContainer: {
    position: 'relative',
    zIndex: 23,
    flexGrow: 0,
    borderRadius: '16px 16px 0 0',
    paddingTop: '16px',
    marginTop: '-16px',
    background: theme.colors.neutralLightest,
  },
}));
