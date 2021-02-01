import { validateEmail, validateName } from "./rules";

const rules = {
  email: () => validateEmail,
  name: () => validateName,
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
