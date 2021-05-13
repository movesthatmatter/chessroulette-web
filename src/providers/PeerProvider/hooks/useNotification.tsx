import capitalize from 'capitalize';
import { RoomActivityRecord, RoomRecord, UserRecord } from 'dstnd-io';
import { toISODateTime } from 'io-ts-isodatetime';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Game } from 'src/modules/Games';
import usePrevious from 'use-previous';
import { addNotification, updateOfferNotification } from '../redux/notificationActions';
import { selectActivityLog, selectPeerProviderState, selectRoomActivity } from '../redux/selectors';
import { OfferNotification, RoomWithPlayActivity } from '../types';

// const getNotificationOfferId = (o: NonNullable<RoomWithPlayActivity['activity']['offer']>) => 
//   `offer-${o.type}-${o.content.byUser.id}-${o.content.toUser.id}`;

// const getNotificationIdFromOffer = (
//   offer: NonNullable<RoomWithPlayActivity['activity']['offer']>,
//   prevOffer: RoomWithPlayActivity['activity']['offer'],
// ) => {
//   const nextId = getNotificationOfferId(offer);
//   const prevId = prevOffer ? `${getNotificationOfferId(prevOffer)}-` : '';

//   if (nextId === prevId) {
//     return `${prevId}${nextId}`;
//   }
// };

export const useNotification = (game: Game) => {
  const { me } = useSelector(selectPeerProviderState);

  const roomActivity = useSelector(selectRoomActivity);

  const prevGame = usePrevious<Game>(game);

  const currentOffer = roomActivity?.type === 'play' ? roomActivity.offer : undefined;
  const prevOffer = usePrevious(currentOffer);

  const activityLog = useSelector(selectActivityLog);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (game.state === 'stopped' && game.winner === '1/2'){

  //   }
  // },[game.state])

  // useEffect(() => {

  // }, [game, prevGame]);

  const currentGameAndOffer = useState({
    game,
    currentOffer,
  })

  useEffect(() => {

  }, [game, currentOffer])

  // console.log()
  useEffect(() => {
    console.log('game changed', game);
  }, [game]);

  useEffect(() => {
    console.log('prev game changed', prevGame);
  }, [prevGame]);

  useEffect(() => {
    // if (!(roomActivity && roomActivity.type === 'play')) {
    //   return;
    // }
    if (!prevGame) {
      return;
    }

    // console.log('room activity update', roomActivity);
    const now = new Date();

    console.group('big use effect');
    console.log('game', game);
    console.log('prev game', prevGame);
    console.log('offer', currentOffer);
    console.log('prev offer', prevOffer);
    console.groupEnd();

    if (!currentOffer && prevOffer) {
      console.group('draw offer voided');
      console.log('game', game);
      console.log('prev game', prevGame);
      console.groupEnd();

      if (prevOffer.type === 'rematch') {
        dispatch(updateOfferNotification({
          notificationId: prevOffer.id,
          status: (prevGame.id !== game.id) ? 'accepted' : 'withdrawn',
        }));
      } else if (prevOffer.type === 'draw' && prevGame.state !== game.state) {
        dispatch(updateOfferNotification({
          notificationId: prevOffer.id,
          status: (game.state === 'stopped' && game.winner === '1/2') ? 'accepted' : 'withdrawn',
        }));
      }
    } else if (currentOffer) {
      switch (currentOffer.type) {
        case 'draw':
          dispatch(
            addNotification({
              notification: {
                // id: now.getTime().toString(),
                id: currentOffer.id,
                timestamp: toISODateTime(now),
                type: 'offer',
                status: 'pending',
                oferType: 'draw',
                byUser: currentOffer.content.byUser,
                toUser: currentOffer.content.toUser,
                // type: currentOffer.type,
                // content: currentOffer.content.byUserId === myUser.id
                //     ? `You offered a draw`
                //     : `${capitalize(currentOffer.content.by)} offers you draw!`,
                content: `${currentOffer.content.byUser.name} offered ${currentOffer.content.toUser.name} a draw`,
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
                // id: now.getTime().toString(),
                id: currentOffer.id,
                timestamp: toISODateTime(now),
                // type: currentOffer.type,
                type: 'offer',
                oferType: 'rematch',
                byUser: currentOffer.content.byUser,
                toUser: currentOffer.content.toUser,
                status: 'pending',
                // content: (
                //   <div>{capitalize(currentOffer.content.by)} send you a rematch offer!</div>
                // ),
                // content: `${capitalize(currentOffer.content.by)} is asking for a rematch!`,
                content: `${currentOffer.content.byUser.name} is asking ${currentOffer.content.toUser.name} for a rematch`,
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
  }, [currentOffer, prevOffer, game, prevGame]);
};
