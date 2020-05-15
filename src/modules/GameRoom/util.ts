// This needs to be smarter
// To make sure it fits in both width and height
export const getBoardSize = (p: {
  screenWidth: number;
  screenHeight: number;
}) => Math.min(p.screenWidth * 0.5, p.screenHeight * 0.8);
