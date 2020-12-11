import React from 'react';
import { Dialog } from './components/Dialog/Dialog';
import { usePeerState } from './components/PeerProvider';

export const RouteEffects: React.FC = () => {
  const peerState = usePeerState();

  return (
    <Dialog
      visible={peerState.status === 'disconnected'}
      title="You got disconnected!"
      content="This could happen if you have another session opened!"
      hasCloseButton={false}
      buttonsStacked
      buttons={[
        {
          label: 'Oh no! Reconnect Me',
          onClick: () => {
            window.location.reload();
          },
          type: 'primary',
          full: true,
        },
        {
          label: "That's fine! Close this Page",
          onClick: () => {
            window.close();
          },
          type: 'secondary',
          full: true,
        },
      ]}
    />
  );
};
