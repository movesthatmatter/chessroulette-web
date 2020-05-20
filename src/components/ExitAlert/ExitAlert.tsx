import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { ColoredButton } from 'src/components/ColoredButton/ColoredButton';
import { Mutunachi } from '../Mutunachi/Mutunachi';


type Props = {
  onClose: () => void;
};

export const ExitAlert: React.FC<Props> = ({
  onClose,
}) => {
  const cls = useStyle();
  return (
    <>
      <div className={cls.container}>
        <div>
          <Mutunachi
            mid={2}
            style={{ height: '90px' }}
          />
          <br />
          <div className={cls.title}>
            Are you sure you want to leave the room?
          </div>
        </div>
        <div className={cls.buttonsContainer}>
          <ColoredButton
            label="Exit Room"
            color="#F7627B"
            padding="0px 8px"
            onClickFunction={() => {
              window.location.href = 'http://chessroulette.now.sh';
            }}
          />
          <div style={{ height: '15px' }} />
          <ColoredButton
            label="Go Back"
            color="#F7627B"
            padding="0px 15px"
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
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
  },
  buttonsContainer: {
    marginTop: '20px',
  },
});
