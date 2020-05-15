import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { ColoredButton } from 'src/components/ColoredButton/ColoredButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Mutunachi } from '../Mutunachi/Mutunachi';


type Props = {
  onRematch: () => void;
  winner: string;
  onClose: () => void;
};

export const GameOverPopup: React.FC<Props> = ({
  onRematch,
  winner,
  onClose,
}) => {
  const cls = useStyle();
  return (
    <>
      <div className={cls.container}>
        <div className={cls.title}>
          {winner}
          {' '}
          won!
        </div>
        <div>
          <Mutunachi
            mid={3}
            style={{ height: '100px' }}
          />
        </div>
        <div className={cls.buttonsContainer}>
          <ColoredButton
            label="Rematch"
            color="#F7627B"
            padding="0px 8px"
            onClickFunction={onRematch}
          />
          <div style={{ height: '15px' }} />
          <ColoredButton
            label="Close Window"
            color="#F7627B"
            fontSize="14px"
            onClickFunction={onClose}
          />
        </div>

      </div>
    </>
  );
};

const useStyle = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Open Sans',
    fontSize: '18px',
    justifyContent: 'center',
    padding: '30px',
  },
  title: {
    fontWeight: 'bold',
  },
  buttonsContainer: {
    marginTop: '20px',
  },
});
