import { GameSpecsRecord } from 'chessroulette-io';
import React, { useState } from 'react';
import { Button, ButtonProps } from 'src/components/Button';
import { Dialog } from 'src/components/Dialog';
import { createUseStyles } from 'src/lib/jss';
import { CreateChallengeDialog } from './CreateChallengeDialog';

type Props = Omit<ButtonProps, 'onClick'> & {
  initialGameSpecs?: GameSpecsRecord;
};

export const CreateChallengeButton: React.FC<Props> = ({ initialGameSpecs, ...buttonProps }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setVisible(true);
        }}
        {...buttonProps}
      />
      <CreateChallengeDialog
        visible={visible}
        initialGameSpecs={initialGameSpecs}
        onCancel={() => setVisible(false)}
      />
    </>
  );
};

const useStyles = createUseStyles({
  container: {},
  mutunachiContainer: {
    width: '50%',
    maxWidth: '300px',
    margin: '0 auto',
  },
  mutunachi: {
    height: '100%',
  },
});
