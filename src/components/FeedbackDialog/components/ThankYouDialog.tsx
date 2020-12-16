import React from 'react';
import { Dialog } from 'src/components/Dialog/Dialog';

type Props = {
  onClose: () => void;
};

export const ThankYouDialog: React.FC<Props> = (props) => {
  return (
    <Dialog
      visible
      onClose={props.onClose}
      title="Thank You!"
      content="Your Feedback means the world to us!"
      buttons={[
        {
          label: 'Done',
          type: 'primary',
          onClick: props.onClose,
        },
      ]}
    />
  );
};
