import { spacers } from 'src/theme/spacers';

export const FLOATING_SHADOW_HORIZONTAL_OFFSET = spacers.large;
export const FLOATING_SHADOW_BOTTOM_OFFSET = `48px`;

export const floatingBoxContainerOffsets = {
  marginLeft: `-${FLOATING_SHADOW_HORIZONTAL_OFFSET}`,
  marginBottom: `-${FLOATING_SHADOW_BOTTOM_OFFSET}`,
};

export const floatingBoxOffsets = {
  paddingLeft: FLOATING_SHADOW_HORIZONTAL_OFFSET,
  paddingRight: FLOATING_SHADOW_HORIZONTAL_OFFSET,
  paddingBottom: FLOATING_SHADOW_BOTTOM_OFFSET,
  marginBottom: `-${FLOATING_SHADOW_BOTTOM_OFFSET}`,
};

export const boxScroller = {
  display: 'flex',
  flex: 1,
  overflowY: 'scroll',
  scrollBehavior: 'smooth',
  width: '100%',
  height: '100%',
};
