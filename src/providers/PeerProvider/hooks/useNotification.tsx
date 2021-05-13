import capitalize from 'capitalize';
import { RoomRecord, UserRecord } from 'dstnd-io';
import { toISODateTime } from 'io-ts-isodatetime';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Game } from 'src/modules/Games';
import { addNotification } from '../redux/notificationActions';
import { selectActivityLog, selectPeerProviderState, selectRoomActivity } from '../redux/selectors';

export const useNotification = (game: Game) => {
  // const { room, me } = useSelector(selectPeerProviderState);

  const roomActivity = useSelector(selectRoomActivity);
  const activityLog = useSelector(selectActivityLog);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log('room activity update', roomActivity);
    const now = new Date();

    if (roomActivity && roomActivity.type === 'play' && roomActivity.offer) {
      switch (roomActivity.offer.type) {
        case 'draw':
          dispatch(
            addNotification({
              notification: {
                id: now.getTime().toString(),
                timestamp: toISODateTime(now),
                type: roomActivity.offer.type,
                // content: roomActivity.offer.content.byUserId === myUser.id
                //     ? `You offered a draw`
                //     : `${capitalize(roomActivity.offer.content.by)} offers you draw!`,
                content: `${roomActivity.offer.content.byUser.name} offered ${
                  roomActivity.offer.content.toUser.name
                } a draw`,
                // resolved : undefined,
                // buttons: [{
                //     type : 'primary',
                //     label: 'Accept',
                // }, {
                //     type : 'secondary',
                //     label: 'Deny'
                // }]
              },
            })
          );
          break;
        case 'rematch':
          dispatch(
            addNotification({
              notification: {
                id: now.getTime().toString(),
                timestamp: toISODateTime(now),
                type: roomActivity.offer.type,
                // content: (
                //   <div>{capitalize(roomActivity.offer.content.by)} send you a rematch offer!</div>
                // ),
                // content: `${capitalize(roomActivity.offer.content.by)} is asking for a rematch!`,
                content: `${roomActivity.offer.content.byUser.name} is asking ${
                  roomActivity.offer.content.toUser.name
                } for a rematch`,
                // resolved: undefined,
                // buttons: [
                //   {
                //     type: 'primary',
                //     label: 'Accept',
                //   },
                //   {
                //     type: 'secondary',
                //     label: 'Deny',
                //   },
                // ],
              },
            })
          );
          break;
      }
    }
  }, [roomActivity]);
};
