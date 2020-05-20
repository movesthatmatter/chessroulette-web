import * as css from 'csstype';

const Keyframes = {
  '0%': null,
};

type X = '0%' | '10%';

export type CSSProperties = css.Properties & {
  '&'?: css.Properties;
  '&:hover'?: css.Properties;
  '&:first-child'?: css.Properties;
  '&:last-child'?: css.Properties;

  '0%'?: css.Properties;
  '5%'?: css.Properties;
  '10%'?: css.Properties;
  '15%'?: css.Properties;
  '20%'?: css.Properties;
  '25%'?: css.Properties;
  '30%'?: css.Properties;
  '35%'?: css.Properties;
  '40%'?: css.Properties;
  '45%'?: css.Properties;
  '50%'?: css.Properties;
  '55%'?: css.Properties;
  '60%'?: css.Properties;
  '65%'?: css.Properties;
  '70%'?: css.Properties;
  '75%'?: css.Properties;
  '80%'?: css.Properties;
  '85%'?: css.Properties;
  '90%'?: css.Properties;
  '95%'?: css.Properties;
  '100%'?: css.Properties;
}
