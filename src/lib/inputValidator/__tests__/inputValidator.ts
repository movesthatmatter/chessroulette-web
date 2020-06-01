import { getInputValidator } from '../inputValidator';

test('It throws validation errors when input invalid', () => {
  const validate = getInputValidator((v) => ({
    email: v.email,
    password: v.min(6),
  }));

  const input = {
    email: 'asda',
    password: '',
  };

  const expected = {
    email: ['The email format is invalid.'],
    password: ['The password field is required.'],
  };

  expect(validate(input)).toEqual(expected);
});

test('It passes validation when input valid', () => {
  const validate = getInputValidator((v) => ({
    email: v.email,
    password: v.min(6),
  }));

  const input = {
    email: 'asda@ad.com',
    password: 'mypassword',
  };

  const expected = {};

  expect(validate(input)).toEqual(expected);
});

test('It works with multiple validation rules ', () => {
  const validate = getInputValidator((v) => ({
    testField: [v.alpha, v.min(7), v.max(10)],
  }));

  const input = {
    testField: 'asdassasdasd',
  };

  const expected = {
    testField: ['The testField may not be greater than 10 characters.'],
  };

  expect(validate(input)).toEqual(expected);
});


test('It makes fields required by default', () => {
  const validate = getInputValidator((v) => ({
    fieldThatIsRequired: v.alpha,
  }));

  const input = {} as {
    fieldThatIsRequired: string;
  };

  const expected = {
    fieldThatIsRequired: ['The fieldThatIsRequired field is required.'],
  };

  expect(validate(input)).toEqual(expected);
});

test('It makes fields optional only with the "optional" rule', () => {
  const validate = getInputValidator((v) => ({
    testField: v.email,
    fieldThatIsOptional: [v.alpha, v.optional],
  }));

  const input = {
    testField: 'asd@ad.com',
  } as {
    testField: string;
    fieldThatIsOptional: undefined | string;
  };

  const expected = {};

  expect(validate(input)).toEqual(expected);
});
