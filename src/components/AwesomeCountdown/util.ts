export const timeLeftToTimeUnits = (durationMs: number) => {
  // const milliseconds = Math.floor((durationMs % 1000));
  const seconds = Math.floor((durationMs / 1000) % 60);
  const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
  const hours = Math.floor((durationMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
    seconds,
  } as const;
};

export const lpad = function (digit: number, length = 2, padding = '0') {
  let res = String(digit);
  while (res.length < length) {
    res = padding + res;
  }
  return res;
};
