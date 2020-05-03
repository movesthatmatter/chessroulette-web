import * as css from 'csstype';

export type CSSProperties = css.Properties & {
  '&'?: css.Properties;
  '&:hover'?: css.Properties;
  '&:first-child'?: css.Properties;
  '&:last-child'?: css.Properties;
}
