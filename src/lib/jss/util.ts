import { CSSProperties } from "./types";

export const makeImportant = (css: CSSProperties) => {
  return Object.keys(css).reduce((accum, key) => {
    return {
      ...accum,
      [key]: `${(css as any)[key]} !important`,
    } as { [k: string]: CSSProperties };
  }, {} as { [k: string]: CSSProperties });
}