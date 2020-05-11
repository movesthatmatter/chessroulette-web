import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { ColoredButton } from 'src/components/ColoredButton/ColoredButton';
import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { CustomInput } from './CustomInput/CustomInput';

type Props = {
  close: () => void;
  dispatchCodeJoin: (value: string) => void;
  dispatchCreate: () => void;
};

const initialInputs = {
  input1: '',
  input2: '',
  input3: '',
  input4: '',
  input5: '',
  input6: '',
};

export const PlayWithFriendsPopup: React.FC<Props> = ({
  close,
  dispatchCodeJoin,
  dispatchCreate,
}) => {
  const cls = useStyle();

  const [inputValues, setInputValues] = useState(initialInputs);

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
          {Object.keys(inputValues).map((inputId) => (
            <CustomInput
              key={inputId}
              inputChanged={(value) => {
                setInputValues((prev) => ({
                  ...prev,
                  [inputId]: value,
                }));
              }}
            />
          ))}
        </div>
        <div>
          <div className={cls.modalButtonContainer}>
            <ColoredButton
              label="JOIN"
              color="#0BCE82"
              fontSize="21px"
              borderRadius="22px"
              width="165px"
              padding="3px"
              onClickFunction={() => {
                const isValid = Object
                  .values(inputValues)
                  .filter((v) => v === '').length === 0;

                if (isValid) {
                  dispatchCodeJoin(Object.values(inputValues).join(''));
                }

                // TODO: Show a message if wrong code
              }}
            />
          </div>
          <div>
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
    marginBottom: '20px',
  },
  exitButton: {
    alignSelf: 'flex-end',
    position: 'absolute',
    right: '3%',
  },
  exitIcon: {
    color: '#E66162',
    cursor: 'pointer',
  },
});
