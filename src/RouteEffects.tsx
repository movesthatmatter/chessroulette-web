import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Dialog } from './components/Dialog/Dialog';
import { selectPeerProviderState, usePeerState } from './components/PeerProvider';
import { toRoomUrlPath } from './lib/util';

export const RouteEffects: React.FC = () => {
  const history = useHistory();
  const peerState = usePeerState();
  const peerProviderState = useSelector(selectPeerProviderState);

  useEffect(() => {
    if (peerProviderState.room) {
      const hasRoomInPath = history.location.pathname.indexOf(peerProviderState.room.slug) > -1;

      if (!hasRoomInPath) {
        history.push(toRoomUrlPath(peerProviderState.room));
      }
    }
  }, [peerProviderState.room, history.location]);

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
