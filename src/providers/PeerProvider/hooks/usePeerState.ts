import { useContext } from 'react';
import { PeerContext } from '../PeerContext';

export const usePeerState = () => useContext(PeerContext);
