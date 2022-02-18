import React, { useEffect, useRef } from 'react';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import cx from 'classnames';
import { document, MouseEvent } from 'window-or-global';
import { ModalDom } from './ModalDom';
import { useBodyClass } from 'src/lib/hooks/useBodyClass';
import { spacers } from 'src/theme/spacers';

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

  useBodyClass([cls.body]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (layerRef.current && layerRef.current.contains(event.target as Node)) {
        return;
      }
      props.onClose && props.onClose();
      return;
    }

    document.addEventListener('mousedown', handleClick);

    const preventBodyClickHandler = (e: HTMLElementEventMap['click']) => {
      e.preventDefault();
    };

    // Stop clicking through the layer
    document.body.addEventListener('click', preventBodyClickHandler);

    return () => {
      document.removeEventListener('mousedown', handleClick);

      // Allow body clicking again!
      document.body.removeEventListener('click', preventBodyClickHandler);
    };
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
  body: {
    overflow: 'hidden',
  },
  backdrop: {
    backgroundColor: theme.name === 'lightDefault' ? 'rgba(0,0,0, 75%)' : 'rgba(0, 0, 0, .6)',
    width: '100%',
    height: '100%',
    left: '0',
    top: '0',
    position: 'fixed',
    zIndex: 99,
  },
  layerContainer: {
    position: 'fixed',
    zIndex: 999,
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  layer: {
    boxSizing: 'border-box',
    transition: 'all 0.3s ease-out',
  },
  verticalSpacer: {
    paddingBottom: spacers.large,
    width: '100%',
  },
}));
