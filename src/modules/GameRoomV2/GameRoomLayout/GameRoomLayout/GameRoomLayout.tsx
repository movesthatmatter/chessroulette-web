import React, { ReactElement } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { ContainerWithDimensions } from 'src/components/ContainerWithDimensions';
import cx from 'classnames';

type Dimensions = { width: number; height: number };

type Props = {
  getGameComponent: (containerDimensions: Dimensions) => ReactElement;
  getSideComponent: (containerDimensions: Dimensions) => ReactElement;
};

const getLayoutSizes = (
  containerDimensions: Dimensions,
  ratios = {
    gameArea: 1,
    sideArea: 0.5,
  },
  offset = 0
): {
  gameArea: number;
  sideArea: number;
} => {
  const gameArea =
    Math.min(containerDimensions.height, containerDimensions.width) - offset;
  const sideArea = gameArea * ratios.sideArea;

  if (gameArea + sideArea <= containerDimensions.width) {
    return { gameArea, sideArea };
  }

  return getLayoutSizes(
    {
      width: containerDimensions.width,
      height: containerDimensions.height,
    },
    ratios,
    offset + 0.01 * containerDimensions.width
  );
};

export const GameRoomLayout: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <ContainerWithDimensions
        className={cls.contentWrapper}
        render={(containerDimensions) => {
          const layout = getLayoutSizes(containerDimensions);

          return (
            <div
              className={cx(cls.content, cls.animated)}
              style={{
                width: layout.gameArea + layout.sideArea,
              }}
            >
              <div
                className={cls.gameArea}
                style={{
                  width: `${layout.gameArea}px`,
                  height: `${layout.gameArea}px`,
                }}
              >
                {props.getGameComponent({
                  width: layout.gameArea,
                  height: layout.gameArea,
                })}
              </div>
              <aside
                className={cls.side}
                style={{
                  width: `${layout.sideArea}px`,
                  height: `${layout.gameArea}px`,
                }}
              >
                {props.getSideComponent({
                  width: layout.sideArea,
                  height: layout.gameArea,
                })}
              </aside>
            </div>
          );
        }}
      />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    width: '100%',
    height: '100%',
  },
  contentWrapper: {
    width: '100%',
    height: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    margin: '0 auto',
  },
  gameArea: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: '10px',
  },
  side: {},
  streamingBox: {},
  chatBox: {},

  animated: {
    transition: 'width 100ms linear',
  }
});
