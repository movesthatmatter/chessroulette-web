import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

type NewPeerPopProps = {
  code: string;
  close: () => void;
};

export const AddNewPeerPopUp: React.FC<NewPeerPopProps> = ({
  code,
  close,
}) => {
  const cls = useStyle();
  return (
    <>
      <div className={cls.exitButton}>
        <FontAwesomeIcon
          icon={faTimesCircle}
          size="lg"
          className={cls.exitIcon}
          onClick={close}
        />
      </div>
      <div className={cls.container}>
        <div className={cls.label}>
          Share the following code with your friends
        </div>
        <div className={cls.bottomContainer}>
          <div className={cls.spacer} />
          <div className={cls.codeContainer}>
            <div className={cls.code}>
              {code}
            </div>
          </div>
          <div className={cls.spacer} />
        </div>
      </div>
    </>
  );
};

const useStyle = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '40px 20px',
  },
  label: {
    fontFamily: 'Open Sans',
    fontSize: '18px',
    color: '#3E3E3E',
  },
  spacer: {
    width: '100%',
  },
  bottomContainer: {
    display: 'flex',
    marginTop: '15px',
  },
  codeContainer: {
    backgroundColor: '#F7627B',
    boxShadow: '1px 1px 8px rgba(0, 0, 0, 0.24)',
    borderRadius: '21px',
    fontFamily: 'Open Sans',
    fontWeight: 'bolder',
    color: 'white',
    lineHeight: '41px',
    fontSize: '30px',
  },
  code: {
    padding: '10px',
  },
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
