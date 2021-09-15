import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { selectMyPeer, selectRoomActivity } from 'src/providers/PeerProvider';
import { colors } from 'src/theme';
import { useGameActions } from 'src/modules/Games/GameActions';
import { InfoNotificationItem } from './components/InfoNotificationItem';
import { OfferNotificationItem } from './components/OfferNotificationItem';
import { selectCurrentRoomActivityLog } from './redux/selectors';
import { useLichessGameActions } from 'src/modules/LichessPlay/LichessGameActions/hooks/useLichessGameActions';
import { RoomActivityType, roomType } from 'dstnd-io';
import { resolveOfferNotificationAction } from './redux/actions';
import { OfferNotification, OfferType } from './types';
import { noop } from 'src/lib/util';
import { useLichessProvider } from 'src/modules/LichessPlay/LichessProvider/hooks/useLichessProvider';

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

type PlayfulActivities = Exclude<RoomActivityType, 'none' | 'analysis'>;
type Offers = 'onDrawAccept' | 'onDrawDecline' | 'onTakebackAccept' | 'onTakebackDecline' | 'onRematchAccepted' | 'onRematchDenied';

type ActivityController = {
    [t in Offers]: {
      [k in PlayfulActivities]: () => void;
    }
};

export const ActivityLog: React.FC<Props> = (props) => {
  const cls = useStyles();
  const myPeer = useSelector(selectMyPeer);
  const gameActions = useGameActions();
  const activityLog = useSelector(selectCurrentRoomActivityLog);
  const [log, setLog] = useState(processLog(activityLog));
  const dummy = useRef<HTMLDivElement>(null);
  const roomActivity = useSelector(selectRoomActivity);
  const lichessGameActions = useLichessGameActions();
  const dispatch = useDispatch();
  
  const gameActionsController: ActivityController = {
    onDrawAccept: {
      play: () => gameActions.onDrawAccepted(),
      lichess: () => lichessGameActions.onDrawAccept(),
    },
    onDrawDecline: {
      play: () => gameActions.onDrawDenied(),
      lichess: () => lichessGameActions.onDrawDecline(),
    },
    onTakebackAccept: {
      play: () => gameActions.onTakebackAccepted(),
      lichess: () => lichessGameActions.onTakebackAccept(),
    },
    onTakebackDecline: {
      play: () => gameActions.onTakebackDeny(),
      lichess: () => lichessGameActions.onTakebackDecline()
    },
    onRematchAccepted: {
      play: () => gameActions.onRematchAccepted(),
      lichess: () => lichessGameActions.acceptRematch()
    },
    onRematchDenied: {
      play: () => gameActions.onRematchDenied(),
      lichess: () => lichessGameActions.denyRematch()
    }
  };

  function resolveNotification(
    notificationId: string,
    status: Exclude<OfferNotification['status'], 'pending'>,
    activityType: PlayfulActivities,
    offerType: keyof ActivityController
  ) {
    gameActionsController[offerType][activityType]()
    if (activityType === 'play') {
      return;
    }
    dispatch(
      resolveOfferNotificationAction({
        notificationId,
        status,
      })
    );
  }

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

  const cancelLichessOffer = (n: OfferNotification) => {
    if (n.offerType === 'draw'){
      lichessGameActions.onDrawDecline()
    }
    if (n.offerType === 'takeback'){
      lichessGameActions.onTakebackDecline();
    }
  }

  return (
    <div className={cls.container}>
      <div className={cls.scroller}>
        <div ref={dummy} />
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

          return (
            <OfferNotificationItem
              key={notification.id}
              notification={notification}
              me={myPeer.user}
              onAcceptOffer={({ offerType }) => {
                if (offerType === 'draw') {
                  resolveNotification(notification.id, 'accepted', roomActivity?.type as PlayfulActivities, 'onDrawAccept')
                } else if (offerType === 'rematch') {
                  resolveNotification(notification.id, 'accepted', roomActivity?.type as PlayfulActivities, 'onRematchAccepted');
                } else if (offerType === 'challenge') {
                  gameActions.onChallengeAccepted();
                } else if (offerType === 'takeback') {
                  resolveNotification(notification.id, 'accepted', roomActivity?.type as PlayfulActivities, 'onTakebackAccept')
                }
              }}
              onDenyOffer={({ offerType }) => {
                if (offerType === 'draw') {
                  resolveNotification(notification.id, 'withdrawn', roomActivity?.type as PlayfulActivities, 'onDrawDecline');
                } else if (offerType === 'rematch') {
                  resolveNotification(notification.id, 'withdrawn', roomActivity?.type as PlayfulActivities, 'onRematchDenied')
                } else if (offerType === 'challenge') {
                  gameActions.onChallengeDenied();
                } else if (offerType === 'takeback') {
                  resolveNotification(notification.id, 'withdrawn', roomActivity?.type as PlayfulActivities, 'onTakebackDecline')
                }
              }}
              //TODO - can be better done but at the moment that means alterating the OfferNotification component
              onCancelOffer={roomActivity?.type === 'play' 
              ? gameActions.onOfferCanceled 
              : roomActivity?.type === 'lichess' 
              ? cancelLichessOffer
              : noop}
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
    paddingLeft: '8px',
    paddingRight: '8px',
    overflowY: 'scroll',
    marginTop: '10px',
    scrollBehavior: 'smooth',
  },
  bottomPart: {
    borderTop: 'solid 1px',
    borderColor: colors.neutral,
  },
});
