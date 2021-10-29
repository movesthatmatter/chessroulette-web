import { createContext } from 'react';
import {
  AuthenticationRecord,
  authenticationService,
  AuthenticationService,
} from './authenticationService';

export type AuthenticationContextState = AuthenticationService & {
  ready: boolean;
  state?: AuthenticationRecord;
};

export const AuthenticationContext = createContext<AuthenticationContextState>({
  ...authenticationService,
  ready: false,
});
