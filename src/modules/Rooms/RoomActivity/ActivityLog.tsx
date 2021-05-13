import React from 'react';
import { useSelector } from 'react-redux';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { Game } from 'src/modules/Games';
import { NotificationItem } from 'src/modules/Rooms/RoomActivity/Notification/NotificationItem';
import { selectActivityLog } from 'src/providers/PeerProvider';
import { useNotification } from 'src/providers/PeerProvider/hooks/useNotification';

type Props = {
    inputContainerStyle : CSSProperties | undefined;
    game : Game;
};

export const ActivityLog: React.FC<Props> = (props) => {
  const cls = useStyles();
  const activityLog = useSelector(selectActivityLog);
  useNotification(props.game);

  return (
    <div className={cls.container}>
      {activityLog.slice(0).map(entry => (
        <NotificationItem notification={entry}/>
      ))}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    marginTop:'10px',
  },
});
