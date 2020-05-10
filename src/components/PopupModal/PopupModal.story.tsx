import React, { useState } from 'react';
import { ColoredButton } from 'src/components/ColoredButton/ColoredButton';
import { PopupModal } from './PopupModal';


export default {
  component: PopupModal,
  title: 'Components/Popup Modal',
};

export const ModalComponent = () => React.createElement(() => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showModal, setShowModal] = useState(false);
  return (
    <div style={{
      display: 'flex',
    }}
    >
      <PopupModal show={showModal}>
        <ColoredButton
          label="Close Popup"
          fontSize="21px"
          color="#FF7262"
          padding="5px"
          onClickFunction={() => setShowModal(false)}
        />
      </PopupModal>
      <ColoredButton
        label="Show Popup"
        fontSize="21px"
        color="#08D183"
        padding="5px"
        onClickFunction={() => setShowModal(true)}
      />
    </div>
  );
});
