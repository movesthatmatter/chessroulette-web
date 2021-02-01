import { validateEmail, validateName, validateDigits } from "./rules";

const rules = {
  email: () => validateEmail,
  name: () => validateName,
  digits: (count: number) => (input: string) => validateDigits(count, input),
};

const messages = {
  email: 'This email doesn\'t look right',
  name: 'The name looks weird',
  firstName: 'The First Name doesn\'t seem valid',
  lastName: 'The Last Name doesn\'t seem valid',
};

export const validator = {
  rules,
  messages,
};
