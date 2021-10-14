import React, { useEffect, useRef } from 'react';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import cx from 'classnames';
import { MouseEvent } from 'window-or-global';
import { ModalDom } from './ModalDom';

type DivAttributes = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export type ModalProps = {
  children: React.ReactNode;
  style?: CSSProperties;
  onClose?: () => void;
};
type Props = DivAttributes & ModalProps;

export const Modal: React.FC<Props> = (props) => {
  const cls = useStyles();
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (layerRef.current && layerRef.current.contains(event.target as Node)) {
        return;
      }
      props.onClose && props.onClose();
      return;
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [layerRef]);

  return (
    <ModalDom>
      <div className={cls.backdrop} />
      <div className={cls.layerContainer}>
        <div className={cx(cls.layer, props.className)} style={props.style} ref={layerRef}>
          {props.children}
        </div>
      </div>
    </ModalDom>
  );
};

const useStyles = createUseStyles((theme) => ({
  backdrop: {
    backgroundColor: theme.name === 'lightDefault' ? 'rgba(0,0,0, 75%)' : 'rgba(0, 0, 0, .6)',
    width: '100%',
    height: '100%',
    left: '0',
    top: '0',
    position: 'fixed',
    zIndex: 100,
  },
  layerContainer: {
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
  layer: {
    boxSizing: 'border-box',
    // transition: 'all 0.3s ease-out',
    margin: '0 auto',
    padding: '20px',
    position: 'fixed',
    color: theme.text.baseColor,
  },
}));
