import * as css from 'csstype';

export type CSSProperties = css.Properties & {
  '&'?: css.Properties;
  '&:hover'?: css.Properties;
}
