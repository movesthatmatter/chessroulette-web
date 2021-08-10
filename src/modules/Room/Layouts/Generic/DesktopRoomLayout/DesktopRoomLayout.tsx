import React, { ReactNode, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { createUseStyles } from 'src/lib/jss';
import { useContainerDimensions } from 'src/components/ContainerWithDimensions';
import { getLayoutSizes, Ratios, isMobile as getIsMobile } from './util';
import { useBodyClass } from 'src/lib/hooks/useBodyClass';
import { GenericLayoutExtendedDimensions } from '../types';

type Props = {
  renderActivityComponent: (d: GenericLayoutExtendedDimensions) => ReactNode;
  renderRightSideComponent: (d: GenericLayoutExtendedDimensions) => ReactNode;
  renderTopComponent: (d: GenericLayoutExtendedDimensions) => ReactNode;
  renderBottomComponent: (d: GenericLayoutExtendedDimensions) => ReactNode;
  topHeight: number;
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
  addRemainingTo?: 'left' | 'center' | 'right' | 'space-between';
};

export const DesktopRoomLayout: React.FC<Props> = ({
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
  const [isMobile, setIsMobile] = useState(getIsMobile(containerDimensions));

  useBodyClass([cls.disableBodyScroll]);

  const getLayout = () => {
    if (!containerDimensions.updated) {
      return {
        leftSide: 0,
        mainArea: 0,
        rightSide: 0,
        remaining: 0,
      };
    }

    const width = containerDimensions.width - horizontalOffset - minSpaceBetween * 2;
    const height = containerDimensions.height - verticalOffset;

    return getLayoutSizes(
      {
        width,
        height,
      },
      {
        leftSide: 0.5,
        mainArea: 1,
        rightSide: 0.5,
        ...props.ratios,
      }
    );
  };

  const [layout, setLayout] = useState(() => getLayout());

  useEffect(() => {
    setLayout(getLayout());
    setIsMobile(getIsMobile(containerDimensions));
  }, [containerDimensions]);

  const verticalPadding = containerDimensions.height - layout.mainArea;

  const occupiedWidth = Math.floor(
    layout.leftSide + layout.mainArea + layout.rightSide + minSpaceBetween * 2
  );

  const extendedDimensions: Omit<GenericLayoutExtendedDimensions, 'container'> = {
    left: {
      width: layout.leftSide,
      height: layout.mainArea,
      horizontalPadding: 0,
      verticalPadding,
    },
    right: {
      width: layout.rightSide,
      height: layout.mainArea,
      horizontalPadding: 0,
      verticalPadding,
    },
    center: {
      width: layout.mainArea,
      height: layout.mainArea,
      horizontalPadding: 0,
      verticalPadding,
    },
    // The activity
    main: {
      // width: occupiedWidth,
      width: layout.leftSide + layout.mainArea,
      height: containerDimensions.height,
      horizontalPadding: containerDimensions.width - occupiedWidth,
      verticalPadding,
    },
    top: {
      width: containerDimensions.width,
      height: props.topHeight,
      horizontalPadding: 0,
      verticalPadding,
    },
    bottom: {
      width: containerDimensions.width,
      height: props.bottomHeight,
      horizontalPadding: 0,
      verticalPadding,
    },
    isMobile,
  };

  return (
    <div className={cx(cls.container, className)}>
      <div style={{ height: props.topHeight }}>
        {props.renderTopComponent({
          ...extendedDimensions,
          container: extendedDimensions.top,
        })}
      </div>
      <div
        className={cls.contentContainer}
        ref={containerRef}
        style={{
          // This is needed so the flex works correctly on the content children
          height: `calc(100% - ${props.topHeight + props.bottomHeight}px)`,
        }}
      >
        <div className={cls.content}>
          <main
            className={cls.mainArea}
            style={{
              width: `${extendedDimensions.main.width}px`,
              height: `100%`,
            }}
          >
            {props.renderActivityComponent({
              ...extendedDimensions,
              container: extendedDimensions.main,
            })}
          </main>
          <aside
            style={{
              width: `${layout.rightSide}px`,
              marginLeft: Math.max(minSpaceBetween, layout.remaining / 2),

              // This is a hack to go above the top & bottom components
              //  But ideally it could be done better!
              height: `calc(100% + ${props.topHeight + props.bottomHeight}px)`,
              marginTop: -props.topHeight,
              position: 'relative',
            }}
          >
            {props.renderRightSideComponent({
              ...extendedDimensions,
              container: extendedDimensions.right,
            })}
          </aside>
        </div>
      </div>
      <div style={{ height: props.bottomHeight }}>
        {props.renderBottomComponent({
          ...extendedDimensions,
          container: extendedDimensions.bottom,
        })}
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    width: '100%',
    height: '100%',

    display: 'flex',
    flexDirection: 'column',
  },
  disableBodyScroll: {
    // Prevent scroll bounciness on Mac
    overflow: 'hidden',
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
  mainArea: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});
