import React, { useRef } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { useContainerDimensions } from 'src/components/ContainerWithDimensions';
import Div100vh from 'react-div-100vh';

type Dimensions = {
  width: number;
  height: number;
}

type Props = {
  getTopArea: (dimensions: Dimensions) => React.ReactNode;
  getMainArea: (dimensions: Dimensions) => React.ReactNode;
};

export const MobileGameRoomLayout: React.FC<Props> = (props) => {
  const cls = useStyles();

  const containerRef = useRef<HTMLDivElement>(null);
  const containerDimensions = useContainerDimensions(containerRef);

  const topContainerRef = useRef<HTMLDivElement>(null);
  const topContainerDimensions = useContainerDimensions(topContainerRef);


  return (
    <Div100vh className={cls.container}>
      <div className={cls.mainWrapper}>
        <div className={cls.main} ref={containerRef}>
          <div className={cls.topContainer} ref={topContainerRef}>
            {props.getTopArea({
              width: topContainerDimensions.width,
              height: topContainerDimensions.height,
            })}
          </div>
          <div className={cls.mainContainer}>
            {props.getMainArea({width: containerDimensions.width, height: containerDimensions.height})}
          </div>
        </div>
      </div>
    </Div100vh>
  );
};

const useStyles = createUseStyles({
  container: {
    height: '100vh',
    width: '100vw',
    background: '#F6F8FB',
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
    marginBottom: '8px',
  },
  mainContainer: {
    flexGrow: 0,
  },
});
