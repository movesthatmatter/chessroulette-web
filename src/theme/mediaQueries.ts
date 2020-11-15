import { CSSProperties } from "src/lib/jss/types";
export const minMediaQuery = (breakPoint: number, css: CSSProperties) => ({
  [`@media screen and (min-width: ${breakPoint}px)`]: css,
}) as { [k: string]: CSSProperties };

export const maxMediaQuery = (breakPoint: number, css: CSSProperties) => ({
  [`@media screen and (max-width: ${breakPoint}px)`]: css,
}) as { [k: string]: CSSProperties };