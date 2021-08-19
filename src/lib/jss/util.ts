import { isObject } from '../util';
import { CSSProperties } from './types';

type CSSObject = Record<string, CSSProperties>;

export const makeImportant = (css: CSSProperties): CSSObject => {
  return Object.keys(css).reduce((accum, key) => {
    const valueAsStringOrNestedCSS = (css as any)[key];

    if (isObject(valueAsStringOrNestedCSS)) {
      return {
        ...accum,
        [key]: makeImportant(valueAsStringOrNestedCSS),
      };
    }

    return {
      ...accum,
      [key]: `${valueAsStringOrNestedCSS} !important`,
    } as CSSObject;
  }, {} as CSSObject);
};
