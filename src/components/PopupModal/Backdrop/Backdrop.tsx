import React from 'react';
import { createUseStyles } from '../../../lib/jss';

type backdropProps = {
  show: boolean;
}
export const Backdrop = ({ show }: backdropProps) => {
  const cls = useStyle();
  return (
    <>
      {show ? <div className={cls.backdrop} /> : null}
    </>
  );
};

const useStyle = createUseStyles({
  backdrop: {
    backgroundColor: 'rgba(0 ,0, 0, 0.55)',
    width: '100%',
    height: '100%',
    left: '0',
    top: '0',
    position: 'fixed',
    zIndex: 10,
  },
});
