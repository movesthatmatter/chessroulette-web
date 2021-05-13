import React from 'react';
import { useSelector } from 'react-redux';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { Game } from 'src/modules/Games';
import { NotificationItem } from 'src/modules/Rooms/RoomActivity/Notification/NotificationItem';
import { OfferNotification, selectActivityLog, selectMyPeer } from 'src/providers/PeerProvider';
import { useNotification } from 'src/providers/PeerProvider/hooks/useNotification';
import { useGameActions } from '../PlayRoom/Layouts/components/GameActions/useGameActions';

type Props = {
    inputContainerStyle : CSSProperties | undefined;
    game : Game;

};

export const ActivityLog: React.FC<Props> = (props) => {
  const cls = useStyles();
  const activityLog = useSelector(selectActivityLog);
  const myPeer = useSelector(selectMyPeer);

  const gameActions = useGameActions();
  
  useNotification(props.game);

  if (!myPeer) {
    return null;
  }

  return (
    <div className={cls.container}>
      {Object.values(activityLog).map(entry => (
        <NotificationItem
          notification={entry}
          me={myPeer.user}
          onAcceptOffer={({ offerType }) => {
            if (offerType === 'draw') {
              gameActions.onDrawAccepted();
            }
            else if (offerType === 'rematch') {
              gameActions.onRematchAccepted();
            }
          }}
          onDenyOffer={({ offerType }) => {
            if (offerType === 'draw') {
              gameActions.onDrawDenied();
            }
            else if (offerType === 'rematch') {
              gameActions.onRematchDenied();
            }
          }}
          onCancelOffer={gameActions.onOfferCanceled}
        />
      ))}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    marginTop:'10px',
  },
});
