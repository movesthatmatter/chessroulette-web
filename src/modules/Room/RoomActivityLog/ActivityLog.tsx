import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { selectMyPeer, selectRoomActivity } from 'src/providers/PeerProvider';
import { colors } from 'src/theme';
import { useGameActions } from 'src/modules/Games/GameActions';
import { InfoNotificationItem } from './components/InfoNotificationItem';
import { OfferNotificationItem } from './components/OfferNotificationItem';
import { selectCurrentRoomActivityLog } from './redux/selectors';
import { ChallengeNotificationItem } from './components/ChallengeNotificationItem';
import { spacers } from 'src/theme/spacers';
import { Text } from 'src/components/Text';
import * as resources from '../resources';
import { InfoNotificationWithActionItem } from './components/InfoNotificationWithAction';
import { clearActivityLogForAllButActivity } from './redux/actions';

type Props = {
  bottomContainerStyle: CSSProperties | undefined;
};

const processLog = (log: ReturnType<typeof selectCurrentRoomActivityLog>) => {
  const sorted = Object.values(log.history).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (log.pending) {
    // Always add the pending notification in the first spot
    return [log.pending, ...sorted];
  }

  return sorted;
};

export const ActivityLog: React.FC<Props> = (props) => {
  const cls = useStyles();
  const myPeer = useSelector(selectMyPeer);
  const gameActions = useGameActions();
  const activityLog = useSelector(selectCurrentRoomActivityLog);
  const [log, setLog] = useState(processLog(activityLog));
  const dummy = useRef<HTMLDivElement>(null);
  const activity = useSelector(selectRoomActivity);
  const dispatch = useDispatch();

useEffect(() => {
  if (activity) {
    dispatch(clearActivityLogForAllButActivity({activity: activity.type}))
  }
},[activity?.type])

  useEffect(() => {
    setLog(processLog(activityLog));
  }, [activityLog]);

  useEffect(() => {
    if (dummy && dummy.current) {
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [log]);

  if (!myPeer) {
    return null;
  }

  return (
    <div className={cls.container}>
      <div className={cls.scroller}>
        <div ref={dummy} />
        {log.length === 0 && (
          <Text size="small1" className={cls.fallbackText}>
            Waiting to see some moves that matter...
          </Text>
        )}
        {log.map((notification) => {
          if (notification.type === 'info') {
            return (
              <InfoNotificationItem
                key={notification.id}
                notification={notification}
                me={myPeer.user}
              />
            );
          }

          if (notification.type === 'challenge') {
            return (
              <ChallengeNotificationItem
                key={notification.id}
                notification={notification}
                me={myPeer.user}
                onCancel={(notification) => {
                  resources.deleteRoomChallenge({
                    challengeId: notification.challenge.id,
                    roomId: notification.challenge.roomId,
                  });
                }}
                onAccept={(notification) => {
                  resources.acceptRoomChallenge({
                    challengeId: notification.challenge.id,
                    roomId: notification.challenge.roomId,
                  });
                }}
              />
            );
          }

          if (notification.type === 'roomSpecific') {
            return (
              <InfoNotificationWithActionItem
                notification={notification}
                key={notification.id}
                me={myPeer.user}
              />
            );
          }
          return (
            <OfferNotificationItem
              key={notification.id}
              notification={notification}
              me={myPeer.user}
              onAcceptOffer={({ offerType }) => {
                if (offerType === 'draw') {
                  gameActions.onDrawAccepted();
                } else if (offerType === 'rematch') {
                  gameActions.onRematchAccepted();
                } else if (offerType === 'challenge') {
                  gameActions.onChallengeAccepted();
                } else if (offerType === 'takeback') {
                  gameActions.onTakebackAccepted();
                }
              }}
              onDenyOffer={({ offerType }) => {
                if (offerType === 'draw') {
                  gameActions.onDrawDenied();
                } else if (offerType === 'rematch') {
                  gameActions.onRematchDenied();
                } else if (offerType === 'challenge') {
                  gameActions.onChallengeDenied();
                } else if (offerType === 'takeback') {
                  gameActions.onTakebackDeny();
                }
              }}
              onCancelOffer={gameActions.onOfferCanceled}
            />
          );
        })}
      </div>
      <div style={props.bottomContainerStyle} className={cls.bottomPart} />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  scroller: {
    display: 'flex',
    flexDirection: 'column-reverse',
    flex: 1,
    overflowY: 'scroll',
    scrollBehavior: 'smooth',
    marginTop: spacers.small,
  },

  bottomPart: {
    borderTop: 'solid 1px',
    borderColor: colors.neutral,
  },
  fallbackText: {
    marginBottom: spacers.large,
  },
});
