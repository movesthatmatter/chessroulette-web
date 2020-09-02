import { createContext } from 'react';
import { AuthenticationState } from './reducer';

export const AuthenticationContext = createContext<AuthenticationState>({
  authenticationType: 'none',
});
