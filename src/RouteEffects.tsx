import React from 'react';
import { Dialog } from './components/Dialog/Dialog';
import { FeedbackDialog } from './components/FeedbackDialog';
import { useFeedbackDialog } from './components/FeedbackDialog/useFeedbackDialog';
import { Page } from './components/Page';
import { usePeerState } from './providers/PeerProvider';
import {
  BrowserNotSupportedDialog,
  useBrowserSupportCheck,
} from './modules/Room/RoomBouncer/index';

export const RouteEffects: React.FC = () => {
  const peerState = usePeerState();
  const feedbackDialog = useFeedbackDialog();
  const { isBrowserUnsupported } = useBrowserSupportCheck();

  if (peerState.status === 'disconnected') {
    return (
      <Page doNotTrack>
        <Dialog
          visible
          title="You got disconnected!"
          content="This could happen if you have another session opened or no internet!"
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
          ]}
        />
      </Page>
    );
  }

  if (isBrowserUnsupported) {
    return <BrowserNotSupportedDialog visible />;
  }

  if (feedbackDialog.state.canShow.anyStep) {
    return <FeedbackDialog />;
  }

  return null;
};
