import { createUseStyles as createUseStylesJSS } from 'react-jss';
import * as css from 'csstype';

// Add stricter types for this function
export const createUseStyles = (s: { [p: string]: css.Properties }) => createUseStylesJSS(s);
