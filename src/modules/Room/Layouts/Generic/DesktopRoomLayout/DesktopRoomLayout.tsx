import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import { createUseStyles } from 'src/lib/jss';
import { useContainerDimensions } from 'src/components/ContainerWithDimensions';
import { getLayoutSizes, Ratios, isMobile as getIsMobile } from './util';
import { useBodyClass } from 'src/lib/hooks/useBodyClass';
import { GenericLayoutExtendedDimensions } from '../types';
import { CustomTheme } from 'src/theme';

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

  useBodyClass([cls.disableBodyScroll]);

  const getLayout = useCallback(() => {
    if (!containerDimensions.updated) {
      return {
        leftSide: 0,
        mainArea: 0,
        rightSide: 0,
        remaining: 0,
      };
    }

    const horizontalOffset = (offsets.right || 0) + (offsets?.left || 0);
    const verticalOffset = (offsets?.top || 0) + (offsets?.bottom || 0);
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
  }, [getLayoutSizes, containerDimensions, minSpaceBetween]);

  const { layout, extendedDimensions } = useMemo(() => {
    const isMobile = getIsMobile(containerDimensions);
    const layout = getLayout();
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

    return {
      extendedDimensions,
      layout,
    };
  }, [containerDimensions, minSpaceBetween]);

  const topComponent = useMemo(
    () =>
      props.renderTopComponent({
        ...extendedDimensions,
        container: extendedDimensions.top,
      }),
    [props.renderTopComponent, extendedDimensions]
  );

  const activityComponent = useMemo(
    () =>
      props.renderActivityComponent({
        ...extendedDimensions,
        container: extendedDimensions.main,
      }),
    [props.renderActivityComponent, extendedDimensions]
  );

  const rightSideComponent = useMemo(
    () =>
      props.renderRightSideComponent({
        ...extendedDimensions,
        container: extendedDimensions.right,
      }),
    [props.renderRightSideComponent, extendedDimensions]
  );

  const renderBottomComponent = useMemo(
    () =>
      props.renderBottomComponent({
        ...extendedDimensions,
        container: extendedDimensions.bottom,
      }),
    [props.renderBottomComponent, extendedDimensions]
  );

  return (
    <div className={cx(cls.container, className)}>
      <div style={{ height: props.topHeight }}>{topComponent}</div>
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
              width: `${
                extendedDimensions.main.width + extendedDimensions.main.horizontalPadding
              }px`,
              // This is a hack to go above the bottom components
              //  But ideally it could be done better!
              // This one was introduced on Oct 14th when I added the Board Settings Bar
              //  But it could also be given as a config from outside if needed!
              height: `calc(100% + ${props.bottomHeight}px)`,
            }}
          >
            {activityComponent}
          </main>
          <aside
            style={{
              width: `${layout.rightSide}px`,
              marginLeft: Math.max(minSpaceBetween),

              // This is a hack to go above the top & bottom components
              //  But ideally it could be done better!
              height: `calc(100% + ${props.topHeight + props.bottomHeight}px)`,
              marginTop: -props.topHeight,
              position: 'relative',
            }}
          >
            {rightSideComponent}
          </aside>
        </div>
      </div>
      <div style={{ height: props.bottomHeight }}>{renderBottomComponent}</div>
    </div>
  );
};

const useStyles = createUseStyles<CustomTheme>((theme) => ({
  container: {
    width: '100%',
    height: '100%',
    background: theme.colors.background,
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
}));
