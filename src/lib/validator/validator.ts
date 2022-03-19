import { validateEmail, validateName, validateDigits, username, notEmpty, string } from './rules';

const rules = {
  email: () => validateEmail,
  name: () => validateName,
  digits: (count: number) => (input: string) => validateDigits(count, input),
  username: () => username,
  notEmpty: () => notEmpty,
  string: () => string,
};

const messages = {
  email: "This email doesn't look right",
  name: 'The name looks weird',
  firstName: "The First Name doesn't seem valid",
  lastName: "The Last Name doesn't seem valid",
  username: "The Username isn't valid",
  notEmpty: "This can't be empty",
  string: "This isn't a string",
};

export const validator = {
  rules,
  messages,
};
