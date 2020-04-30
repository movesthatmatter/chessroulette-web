export const noop = () => {
  // do nothing
};

export const range = (length: number, startAt = 0) =>
  Array.from({ length }, (_, i) => i + startAt);
