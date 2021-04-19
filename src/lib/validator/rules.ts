export const validateEmail = (input: string) => {
  const r = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return r.test(String(input).toLowerCase());
};

export const validateName = (s: string) => /^[a-zA-Z ]{2,100}$/.test(s);

export const validateDigits = (count: number, input: string) => {
  return new RegExp(`^[0-9]\{${count}\}$`, 'g').test(input);
};

export const username = (s: string) => /^[a-zA-Z0-9_-]{3,24}$/.test(s);

export const notEmpty = (s?: string) => !!(s && s.length > 0);
