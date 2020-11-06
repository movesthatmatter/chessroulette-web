import ValidatorJS from 'validatorjs';
import en from 'validatorjs/src/lang/en';
import { inputValidationRules } from './inputValidationRules';

ValidatorJS.setMessages('en', en);


export const validator = inputValidationRules;

export type Validator = typeof validator;
export type ValidationInput = {[k: string]: unknown};
export type ValidationRule = string | string[];
export type ValidationRulesMap<I extends ValidationInput> = {[k in keyof I]: ValidationRule};


const parseRule = (r: ValidationRule) => {
  let rulesArray = Array.isArray(r)
    ? r
    : r.split('|'); // split each rule individualy

  // prepend required if not already present or no optional present
  rulesArray = (rulesArray.indexOf('required') > -1 || rulesArray.indexOf('optional') > -1)
    ? rulesArray
    : ['required'].concat(rulesArray);

  // take optional out
  const optionalIndex = rulesArray.indexOf('optional');
  rulesArray = (optionalIndex > -1)
    ? rulesArray.slice(0, optionalIndex).concat(rulesArray.slice(optionalIndex + 1))
    : rulesArray;

  return rulesArray.join('|');
};

const parseRules = <I extends ValidationInput>(rules: ValidationRulesMap<I>) => (
  Object.keys(rules)
    .reduce((res, k: keyof I) => {
      res[k] = parseRule(rules[k]);

      return res;
    }, {} as typeof rules)
);

type GetRules<I extends ValidationInput> = (v: Validator) => ValidationRulesMap<I>;

export const getInputValidator = <I extends ValidationInput>(getRules: GetRules<I>) => {
  const rules = parseRules(getRules(validator));

  return (input: I) => {
    const v = new ValidatorJS(input, rules);

    // This is not an typo, for some reason the errors are nested!
    return v.fails() ? v.errors.errors : {};
  };
};
