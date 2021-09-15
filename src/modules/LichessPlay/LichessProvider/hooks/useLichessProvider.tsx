import { useContext } from 'react';
import { LichessContext } from '../LichessProvider';

export const useLichessProvider = () => {
  return useContext(LichessContext);
}
