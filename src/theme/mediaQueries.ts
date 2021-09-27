import { CSSProperties, NestedCSSElement } from 'src/lib/jss/types';
import { keyInObject } from 'src/lib/util';
export const minMediaQuery = (
  breakPoint: number,
  css: CSSProperties,
  inheritedStyle: CSSProperties = {}
) => {
  // TODO: Look this up - is maxWidth the correct name as Chome says?
  const mediaQueryPropName = `@media screen and (min-width: ${breakPoint}px)`;
  const inheritedCss = keyInObject(inheritedStyle, mediaQueryPropName)
    ? (inheritedStyle[mediaQueryPropName] as NestedCSSElement)
    : {};

  return {
    [mediaQueryPropName]: {
      ...inheritedCss,
      ...css,
    },
  } as { [k: string]: CSSProperties };
};

export const maxMediaQuery = (
  breakPoint: number,
  css: CSSProperties,
  inheritedStyle: CSSProperties = {}
) => {
  // TODO: Look this up - is minWidth the correct name as Chome says?
  const mediaQueryPropName = `@media screen and (max-width: ${breakPoint}px)`;
  const inheritedCss = keyInObject(inheritedStyle, mediaQueryPropName)
    ? (inheritedStyle[mediaQueryPropName] as NestedCSSElement)
    : {};

  return {
    [mediaQueryPropName]: {
      ...inheritedCss,
      ...css,
    },
  } as { [k: string]: CSSProperties };
};

export const MOBILE_BREAKPOINT = 599;
export const SMALL_MOBILE_BREAKPOINT = 374;

export const onlyMobile = (css: CSSProperties, inheritedStyle?: CSSProperties) =>
  maxMediaQuery(MOBILE_BREAKPOINT, css, inheritedStyle);
export const onlyDesktop = (css: CSSProperties, inheritedStyle?: CSSProperties) =>
  minMediaQuery(MOBILE_BREAKPOINT, css, inheritedStyle);

export const onlySmallMobile = (css: CSSProperties, inheritedStyle?: CSSProperties) =>
  maxMediaQuery(SMALL_MOBILE_BREAKPOINT, css, inheritedStyle);

export const hideOnMobile = onlyMobile({ display: 'none' });
export const hideOnDesktop = onlyDesktop({ display: 'none' });
