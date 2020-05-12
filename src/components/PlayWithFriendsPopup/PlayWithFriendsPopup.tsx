import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { ColoredButton } from 'src/components/ColoredButton/ColoredButton';
import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { CustomInput } from './CustomInput/CustomInput';

type Props = {
  close: () => void;
  dispatchCodeJoin: (value: string) => void;
  dispatchCreate: () => void;
};

export const PlayWithFriendsPopup: React.FC<Props> = ({
  close,
  dispatchCodeJoin,
  dispatchCreate,
}) => {
  const cls = useStyle();
  const [inputValue, setInputValue] = useState('');
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
      <div className={cls.modalContainer}>
        <div className={cls.modalTitle}>Enter room CODE:</div>
        <div className={cls.codeInputContainer}>
          <CustomInput onChange={(value) => setInputValue(value)} />
        </div>
        <div className={cls.bottomPart}>
          <Mutunachi
            mid={11}
            width="101"
            height="132"
            style={{ marginRight: '20px' }}
          />
          <div className={cls.modalButtonContainer}>
            <div style={{ marginBottom: '30px' }}>
              <ColoredButton
                label="JOIN"
                color="#0BCE82"
                fontSize="21px"
                borderRadius="22px"
                width="165px"
                padding="3px"
                onClickFunction={() => {
                  dispatchCodeJoin(inputValue);
                }}
              />
            </div>
            <div style={{ marginBottom: '30px' }}>
              <ColoredButton
                label="CREATE NEW"
                color="#E66162"
                fontSize="21px"
                borderRadius="22px"
                width="165px"
                padding="3px"
                onClickFunction={dispatchCreate}
              />
            </div>
          </div>
          <Mutunachi
            mid={3}
            width="122"
            height="166"
          />
        </div>
      </div>
    </>
  );
};

const useStyle = createUseStyles({
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    padding: '20px',
  },
  codeInputContainer: {
    marginBottom: '20px',
    alignSelf: 'center',
  },
  modalTitle: {
    fontFamily: 'Roboto',
    fontSize: '24px',
    lineHeight: '33px',
    fontWeight: 'normal',
    marginBottom: '5px',
    color: '#262626',
    textAlign: 'center',
  },
  modalButtonContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  bottomPart: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
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
