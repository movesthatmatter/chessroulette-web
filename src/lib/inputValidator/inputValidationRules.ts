/**
 * https://www.npmjs.com/package/validatorjs#available-rules
 */
export const inputValidationRules = {
  get accepted() {
    return 'accepted';
  },
  after(d: Date) {
    return `after:${d.toISOString()}`;
  },
  afterOrEqual(d: Date) {
    return `after_or_equal:${d.toISOString()}`;
  },
  get alpha() {
    return 'alpha';
  },
  get alphaDash() {
    return 'alpha_dash';
  },
  get alphaNum() {
    return 'alpha_num';
  },
  get array() {
    return 'array';
  },
  before(d: Date) {
    return `before:${d.toISOString()}`;
  },
  beforeOrEqual(d: Date) {
    return `before_or_equal:${d.toISOString()}`;
  },
  between(min: number, max: number) {
    return `between:${min},${max}`;
  },
  get boolean() {
    return 'boolean';
  },
  get confirmed() {
    return 'confirmed';
  },
  get date() {
    return 'date';
  },
  digits(v: number) {
    return `digits:${v}`;
  },
  digitsBetween(min: number, max: number) {
    return `digits_between:${min},${max}`;
  },
  different(attribute: string) {
    return `different:${attribute}`;
  },
  get email() {
    return 'email';
  },
  get hex() {
    return 'hex';
  },
  in(values: string[]) {
    return `${values.join(',')}`;
  },
  get integer() {
    return 'integer';
  },
  max(value: number) {
    return `max:${value}`;
  },
  min(value: number) {
    return `min:${value}`;
  },
  notIn(values: string[]) {
    return `not_in:${values.join(',')}`;
  },
  get numeric() {
    return 'numeric';
  },
  get present() {
    return 'present';
  },
  get optional() {
    return 'optional';
  },
  get required() {
    return 'required';
  },
  requiredIf(anotherField: string, value: number) {
    return `required_if:${anotherField},${value}`;
  },
  requiredUnless(anotherField: string, valueAsString: string) {
    return `required_unless:${anotherField},${valueAsString}`;
  },
  requiredWith(fields: string[]) {
    return `required_with:${fields.join(',')}`;
  },
  requiredWithAll(fields: string[]) {
    return `required_with_all:${fields.join(',')}`;
  },
  requiredWithout(fields: string[]) {
    return `required_without:${fields.join(',')}`;
  },
  requiredWithoutAll(fields: string[]) {
    return `required_without_all:${fields.join(',')}`;
  },
  same(attribute: string) {
    return `same:${attribute}`;
  },
  size(value: number) {
    return `size:${value}`;
  },
  get string() {
    return 'string';
  },
  multiple(...rulesAsArgs: string[]) {
    return rulesAsArgs.map((r) => r).join('|');
  },
  regex(pattern: string) {
    return `regex:${pattern}`;
  },
};
