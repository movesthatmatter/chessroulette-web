import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { createUseStyles } from 'src/lib/jss';

type Props = {
  hasCloseButton?: false;
} | {
  hasCloseButton: true;
  onClose: () => void;
}

export const PopupContent: React.FC<Props> = (props) => {
  const cls = useStyle();
  return (
    <div>
      {props.hasCloseButton && (
        <div className={cls.exitButton}>
          <FontAwesomeIcon
            icon={faTimesCircle}
            size="lg"
            className={cls.exitIcon}
            onClick={() => props.onClose()}
          />
        </div>
      )}
      <div className={cls.modalContainer}>
        {props.children}
      </div>
    </div>
  );
};

const useStyle = createUseStyles({
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    padding: '20px',
    maxWidth: '500px',
  },
  // modalTitle: {
  //   fontFamily: 'Roboto',
  //   fontSize: '24px',
  //   lineHeight: '33px',
  //   fontWeight: 'normal',
  //   marginBottom: '5px',
  //   color: '#262626',
  //   textAlign: 'center',
  // },
  exitButton: {
    alignSelf: 'flex-end',
    position: 'absolute',
    right: '5%',
    top: '4%',
  },
  exitIcon: {
    color: '#E66162',
    cursor: 'pointer',
  },
});
