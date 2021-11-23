export const timeLeftToTimeUnits = (duration: number) => {
  // const milliseconds = Math.floor((duration % 1000) / 100);
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  const days = Math.floor(duration / (1000 * 60 * 60 * 24));

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
