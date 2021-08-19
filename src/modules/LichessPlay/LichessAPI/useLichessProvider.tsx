import React, { useContext } from 'react';
import { LichessContext } from './LichessProvider'

export const useLichessProvider = () => {
  const context = useContext(LichessContext);
  
  if (!context) {
    return null;
  }
  return context;
};
