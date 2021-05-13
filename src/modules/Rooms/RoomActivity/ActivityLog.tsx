import React from 'react';
import { useSelector } from 'react-redux';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { Game } from 'src/modules/Games';
import { NotificationItem } from 'src/modules/Rooms/RoomActivity/Notification/NotificationItem';
import { selectActivityLog, selectMyPeer } from 'src/providers/PeerProvider';
import { useNotification } from 'src/providers/PeerProvider/hooks/useNotification';

type Props = {
    inputContainerStyle : CSSProperties | undefined;
    game : Game;

};

export const ActivityLog: React.FC<Props> = (props) => {
  const cls = useStyles();
  const activityLog = useSelector(selectActivityLog);
  const myPeer = useSelector(selectMyPeer);
  
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
          onAcceptOffer={() => {
            console.log('accepted ', entry);
          }}
          onDenyOffer={() => {
            console.log('denied ', entry);
          }}
          onCancelOffer={() => {
            console.log('canceled ', entry);
          }}
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
