import withStyles, {
  WithStylesProps as WithStylesPropsJSS,
  Styles,
} from 'react-jss';
import { CSSProperties } from './types';

export function createStyles<
  TProps extends { [prop in keyof CSSProperties]: CSSProperties[prop] },
  TStyle extends { [cls: string]: TProps },
  TClasses extends { [k in keyof TStyle]: string }
>(
  // Not sure how and why this works but fuck it!
  // It only works with Partial not without
  styles: Partial<TStyle>,
): <Props extends {}>(
    comp: React.ComponentType<Props & { classes: TClasses }>
  ) => React.ComponentType<Props> {
  // TODO: Maybe fix these any sometime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return withStyles(styles as any) as any;
}

export type StyledProps<S extends Styles> = WithStylesPropsJSS<S>;
