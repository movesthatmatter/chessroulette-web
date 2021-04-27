import React from 'react';
import { AspectRatio } from 'src/components/AspectRatio';
import { Dialog } from 'src/components/Dialog';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { createUseStyles } from 'src/lib/jss';

type Props = {
  visible: boolean;
  onClose?: () => void;
};

export const WelcomeNewUserDialog: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <Dialog
      visible={props.visible}
      title="Welcome to Chessroulette!"
      onClose={props.onClose}
      graphic={
        <div className={cls.mutunachiContainer}>
          <Mutunachi mid="19" />
        </div>
      }
      content="works"
      // contentContainerClass={cls.contentContainer}
    />
  );
};

const useStyles = createUseStyles({
  container: {},
  mutunachiContainer: {
    width: '60%',
    maxWidth: '300px',
    margin: '0 auto',
  },
  mutunachi: {
    height: '100%',
  },
});
