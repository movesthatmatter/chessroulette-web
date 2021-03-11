export const validateEmail = (input: string) => {
  const r = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return r.test(String(input).toLowerCase());
};

export const validateName = (input: string) => {
  const r = /^[a-zA-Z ]{2,100}$/;
  return r.test(input);
}

export const validateDigits = (count: number, input: string) => {
  return new RegExp(`^[0-9]\{${count}\}$`, 'g').test(input);
}
