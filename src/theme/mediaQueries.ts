import { CSSProperties } from "src/lib/jss/types";
export const minMediaQuery = (breakPoint: number, css: CSSProperties) => ({
  [`@media screen and (min-width: ${breakPoint}px)`]: css,
}) as { [k: string]: CSSProperties };

export const maxMediaQuery = (breakPoint: number, css: CSSProperties) => ({
  [`@media screen and (max-width: ${breakPoint}px)`]: css,
}) as { [k: string]: CSSProperties };

export const MOBILE_BREAKPOINT = 600;
export const SMALL_MOBILE_BREAKPOINT = 400;

export const onlyMobile = (css: CSSProperties) => maxMediaQuery(MOBILE_BREAKPOINT, css);
export const onlyDesktop = (css: CSSProperties) => minMediaQuery(MOBILE_BREAKPOINT, css);

export const onlySmallMobile = (css: CSSProperties) => maxMediaQuery(SMALL_MOBILE_BREAKPOINT, css);

export const hideOnMobile = onlyMobile({ 'display': 'none'});
export const hideOnDesktop = onlyDesktop({ 'display': 'none'});