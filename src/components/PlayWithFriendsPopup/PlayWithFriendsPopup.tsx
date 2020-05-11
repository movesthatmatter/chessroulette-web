import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { ColoredButton } from 'src/components/ColoredButton/ColoredButton';
import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { CustomInput } from './CustomInput/CustomInput';

type popProps = {
  close: () => void;
  dispatchCodeJoin: (value: string) => void;
  dispatchCreate: () => void;
}
type inputs = 'input1' | 'input2' | 'input3' | 'input4' | 'input5' | 'input6';
type inputTypes = {
  [key in inputs]: string;
};
export const PlayWithFriendsPopup = ({ close, dispatchCodeJoin, dispatchCreate }: popProps) => {
  const cls = useStyle();
  const inputValues: inputTypes = {
    input1: '',
    input2: '',
    input3: '',
    input4: '',
    input5: '',
    input6: '',
  };
  const inputChangedHandler = (value: string, id: inputs) => {
    inputValues[id] = value;
  };
  const joinHandler = () => {
    let valid = true;
    Object.values(inputValues).forEach((value) => {
      if (value === '') {
        valid = false;
      }
    });
    if (valid) {
      dispatchCodeJoin(Object.values(inputValues).join(''));
    }
  };
  return (
    <>
      <div className={cls.exitButton}>
        <FontAwesomeIcon
          icon={faTimesCircle}
          size="lg"
          className={cls.exitIcon}
          onClick={() => close()}
        />
      </div>
      <div className={cls.modalContainer}>
        <div className={cls.modalTitle}>
          Enter room CODE:
        </div>
        <div className={cls.codeInputContainer}>
          {Object.keys(inputValues).map((input) => (
            <CustomInput
              key={input}
              inputChanged={(value: string) => inputChangedHandler(value, input as inputs)}
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
              onClickFunction={() => joinHandler()}
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
              onClickFunction={() => dispatchCreate()}
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
