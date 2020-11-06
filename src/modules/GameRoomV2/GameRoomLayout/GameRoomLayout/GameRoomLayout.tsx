import React, { ReactNode, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { createUseStyles } from 'src/lib/jss';
import { useContainerDimensions } from 'src/components/ContainerWithDimensions';
import { Dimensions, getLayoutSizes, normalizeRatios, Ratios } from './util';

type AllDimensions = {
  gameAreaWidth: number;
  leftSideWidth: number;
  rightSideWidth: number;
}

type Props = {
  getGameComponent: (containerDimensions: Dimensions) => ReactNode;
  getRightSideComponent: (containerDimensions: Dimensions) => ReactNode;
  getLeftSideComponent: (containerDimensions: Dimensions) => ReactNode;
  getTopComponent: (dimensions: AllDimensions) => ReactNode;
  topHeight: number;
  getBottomComponent: (containerDimensions: AllDimensions) => ReactNode;
  bottomHeight: number;
  offsets?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  minSpaceBetween?: number;
  ratios?: Partial<Ratios>;
  className?: string;
};

export const GameRoomLayout: React.FC<Props> = ({
  offsets = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  minSpaceBetween = 0,
  className,
  ...props
}) => {
  const cls = useStyles();
  const containerRef = useRef(null);
  const containerDimensions = useContainerDimensions(containerRef);

  const horizontalOffset = (offsets.right || 0) + (offsets?.left || 0);
  const verticalOffset = (offsets?.top || 0) + (offsets?.bottom || 0);

  const getLayout = () => {
    const normalizedRatios = normalizeRatios({
      leftSide: 0.5,
      gameArea: 1,
      rightSide: 0.5,
      ...props.ratios,
    });

    return getLayoutSizes(
      {
        width: containerDimensions.width - horizontalOffset - minSpaceBetween * 2,
        height: containerDimensions.height - verticalOffset - props.topHeight,
      },
      normalizedRatios
    );
  };

  const [layout, setLayout] = useState(() => getLayout());

  useEffect(() => {
    setLayout(getLayout());
  }, [containerDimensions]);

  const verticalPadding = containerDimensions.height - layout.gameArea;
  const horizontalPadding = containerDimensions.height - layout.gameArea;

  return (
    <div className={cx(cls.container, className)}>
      <div className={cls.top}>
        {props.getTopComponent({
          leftSideWidth: layout.leftSide,
          rightSideWidth: layout.rightSide,
          gameAreaWidth: layout.gameArea,
        })}
      </div>
      <div className={cls.contentContainer} ref={containerRef} style={{
          // This is needed so the flex works correctly on the content children
          height: `calc(100% - ${props.topHeight + props.bottomHeight}px)`,
        }}>
        <div className={cls.content}>
          <aside
            className={cls.side}
            style={{
              width: `${layout.leftSide}px`,
              marginRight: minSpaceBetween,
              height: `100%`,
            }}
          >
            {props.getLeftSideComponent({
              width: layout.leftSide,
              height: layout.gameArea,
              verticalPadding,
            })}
          </aside>
          <main
            className={cls.gameArea}
            style={{
              width: `${layout.gameArea}px`,
              height: `100%`,
            }}
          >
            {props.getGameComponent({
              width: layout.gameArea,
              height: layout.gameArea,
              verticalPadding,
            })}
          </main>
          <aside
            className={cls.side}
            style={{
              width: `${layout.rightSide}px`,
              height: `100%`,
              marginLeft: minSpaceBetween,
            }}
          >
            {props.getRightSideComponent({
              width: layout.rightSide,
              height: layout.gameArea,
              verticalPadding,
            })}
          </aside>
        </div>
      </div>
      <div className={cls.bottom}>
        {props.getBottomComponent({
          leftSideWidth: layout.leftSide,
          rightSideWidth: layout.rightSide,
          gameAreaWidth: layout.gameArea,
        })}
      </div>
    </div>
  );
};

const transitionsEffect = {
  transition: 'all 150ms ease-in',
};

const useStyles = createUseStyles({
  container: {
    width: '100%',
    height: '100%',

    display: 'flex',
    flexDirection: 'column',
  },
  top: {
    ...transitionsEffect,
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  gameArea: {
    display: 'flex',
    justifyContent: 'flex-end',
    ...transitionsEffect,
  },
  side: {
    ...transitionsEffect,
  },
  bottom: {
    ...transitionsEffect,
  }
});
