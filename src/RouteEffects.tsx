import { ChallengeRecord, RoomRecord } from 'dstnd-io';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Dialog } from './components/Dialog/Dialog';
import { FeedbackDialog } from './components/FeedbackDialog';
import { useFeedbackDialog } from './components/FeedbackDialog/useFeedbackDialog';
import { Page } from './components/Page';
import { usePeerState } from './components/PeerProvider';
import { SocketConsumer } from './components/SocketProvider';
import { toRoomUrlPath } from './lib/util';
import { ChallengeWidget } from './modules/Challenges/Widgets/ChallengeWidget';
import { BrowserNotSupportedDialog, useGenericRoomBouncer } from './modules/Rooms/GenericRoom';

type ActivityState =
  | {
      activity: 'none';
    }
  | {
      activity: 'joinedRoom';
      room: RoomRecord;
    }
  | {
      activity: 'pendingChallenge';
      challenge: ChallengeRecord;
    };

export const RouteEffects: React.FC = () => {
  const peerState = usePeerState();
  const history = useHistory();
  const [activityState, setActivityState] = useState<ActivityState>({ activity: 'none' });
  const feedbackDialog = useFeedbackDialog();
  const { state: bouncerState } = useGenericRoomBouncer();

  const onChallengeOrRoomPage = (slug: string) => history.location.pathname.indexOf(slug) > -1;

  if (peerState.status === 'disconnected') {
    return (
      <Page>
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

  if (!bouncerState.browserIsSupported) {
    return <BrowserNotSupportedDialog visible />;
  }

  if (feedbackDialog.state.canShow.anyStep) {
    return <FeedbackDialog />;
  }

  return (
    <SocketConsumer
      onMessage={(msg) => {
        if (msg.kind === 'iam') {
          if (msg.content.hasJoinedRoom && !onChallengeOrRoomPage) {
            setActivityState({
              activity: 'joinedRoom',
              room: msg.content.room,
            });
          } else if (
            msg.content.hasActiveChallenge &&
            !onChallengeOrRoomPage(msg.content.challenge.slug)
          ) {
            setActivityState({
              activity: 'pendingChallenge',
              challenge: msg.content.challenge,
            });
          }
        }
      }}
      render={({ send }) => (
        <>
          {activityState.activity === 'pendingChallenge' && (
            <ChallengeWidget
              challenge={activityState.challenge}
              onAccepted={(room) => {
                setActivityState({ activity: 'none' });

                history.push(toRoomUrlPath(room));
              }}
              onMatched={(room) => {
                setActivityState({ activity: 'none' });

                history.push(toRoomUrlPath(room));
              }}
              onDenied={() => {
                setActivityState({ activity: 'none' });
              }}
              onCanceled={() => {
                setActivityState({ activity: 'none' });
              }}
            />
          )}
          {activityState.activity === 'joinedRoom' && (
            <Dialog
              visible
              title="Joined Room"
              content="You are already part of a Room. What do you wnat to do?"
              buttonsStacked
              buttons={[
                {
                  label: 'Go to Room',
                  type: 'primary',
                  onClick: () => {
                    history.push(toRoomUrlPath(activityState.room));

                    setActivityState({ activity: 'none' });
                  },
                },
                {
                  label: 'Leave Room',
                  type: 'secondary',
                  onClick: () => {
                    send({
                      kind: 'leaveRoomRequest',
                      content: undefined,
                    });

                    setActivityState({ activity: 'none' });
                  },
                },
              ]}
            />
          )}
        </>
      )}
    />
  );
};
