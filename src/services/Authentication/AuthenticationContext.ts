import { GuestUserRecord, RegisteredUserRecord } from 'dstnd-io';
import { createContext } from 'react';
// import { AuthenticationState } from './reducer';

export const AuthenticationContext = createContext<RegisteredUserRecord | GuestUserRecord | undefined>(undefined);
