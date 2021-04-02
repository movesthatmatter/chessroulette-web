export const getBoxShadow = (
  x: number,
  y: number,
  blur: number,
  inset: number,
  color: string,
) => {
  return `${x}px ${y}px ${blur}px ${inset}px ${color}`;
};
