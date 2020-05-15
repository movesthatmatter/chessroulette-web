import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Backdrop } from './Backdrop/Backdrop';

type ModalProps = {
  show: boolean;
  children: React.ReactNode;
}
export const PopupModal = ({ show, children }: ModalProps) => {
  const cls = useStyles();
  if (!show) {
    return null;
  }
  return (
    <>
      <Backdrop show={show} />
      <div className={cls.modal}>
        <div
          className={cls.container}
          style={{
            transform: show ? 'translateY(0)' : 'translateY(-100vh)',
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};

const useStyles = createUseStyles({
  modal: {
    position: 'fixed',
    zIndex: 100,
    width: '100%',
    height: '100%',
    top: '0',
    left: '0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    boxSizing: 'border-box',
    transition: 'all 0.3s ease-out',
    backgroundColor: 'white',
    margin: '0 auto',
    boxShadow: '1px 1px 20px rgba(0, 0, 0, 0.13)',
    borderRadius: '35px',
    padding: '3px',
  },
});
