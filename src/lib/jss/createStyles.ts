import withStyles, {
  WithStylesProps as WithStylesPropsJSS,
  Styles,
} from 'react-jss';
import { Classes } from 'jss';
import * as css from 'csstype';

export function createStyles<
  ClassNames extends string | number | symbol,
  S extends Record<string, css.Properties>|((theme: unknown) => Styles<ClassNames>)
>(
  styles: S): [
    S,
    <
      Props extends {
        classes: S extends (theme: unknown) => Styles<ClassNames>
          ? Classes<keyof ReturnType<S>>
          : Classes<ClassNames>;
      }
    >(
      comp: React.ComponentType<Props>
    ) => React.ComponentType<
    Omit<Props, 'classes'> & { classes?: Partial<Props['classes']> }
    >
  ] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return [styles, withStyles(styles as any)];
}

export type StyledProps<
  S extends Styles | ((theme: unknown) => Styles)
> = WithStylesPropsJSS<S>;
