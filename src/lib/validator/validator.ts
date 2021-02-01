import { validateEmail } from "./rules";

const rules = {
  email: () => validateEmail,
};

const messages: {[k in keyof typeof rules]: string} = {
  email: 'The email isn\'t valid',
}

export const validator = {
  rules,
  messages,
};
