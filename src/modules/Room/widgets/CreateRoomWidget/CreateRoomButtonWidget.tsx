import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { createUseStyles } from 'src/lib/jss';
import { toRoomUrlPath } from 'src/lib/util';
import { usePeerState } from 'src/providers/PeerProvider';
import { createRoom } from 'src/resources/resources';
import { useUserAuthentication } from 'src/services/Authentication';
import { console } from 'window-or-global';

type Props = {};

export const CreateRoomButtonWidget: React.FC<Props> = (props) => {
  const cls = useStyles();
  const peerState = usePeerState();

  // const auth = useUserAuthentication();
  const history = useHistory();
  // const

  // useEffect(() => {
  //   if (peerState.status !== 'open') {
  //     return;
  //   }

  //   // if (peerState.hasJoinedRoom) {
  //   //   history.push(toRoomUrlPath(peerState.room));
  //   // }
  // }, [peerState.status === 'open' && peerState.hasJoinedRoom])

  return (
    <Button
      label="Create Analysis Room"
      disabled={peerState.status !== 'open'}
      onClick={() => {
        if (peerState.status !== 'open') {
          return;
        }

        createRoom({
          type: 'public',
          activityType: 'analysis',
          userId: peerState.me.id,
        }).map((room) => {
          if (!peerState.hasJoinedRoom) {
            peerState.joinRoom({
              id: room.id,
              code: room.code || undefined,
            });
            history.push(toRoomUrlPath(room));
          }
        });
      }}
    />
  );
};

const useStyles = createUseStyles({
  container: {},
});
