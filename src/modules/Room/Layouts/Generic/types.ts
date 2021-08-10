import { LayoutContainerDimensions } from '../types';

export type GenericLayoutExtendedDimensions = {
  container: LayoutContainerDimensions;
  top: LayoutContainerDimensions;
  main: LayoutContainerDimensions;
  bottom: LayoutContainerDimensions;
  center: LayoutContainerDimensions;
  left: LayoutContainerDimensions;
  right: LayoutContainerDimensions;
  isMobile: boolean;
};
