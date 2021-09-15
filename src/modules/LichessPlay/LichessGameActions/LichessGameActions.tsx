import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionButton, Button } from 'src/components/Button';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import {
  addNotificationAction,
} from 'src/modules/Room/RoomActivityLog/redux/actions';
import { selectCurrentRoomActivityLog } from 'src/modules/Room/RoomActivityLog/redux/selectors';
import {
  RegisteredUserRecordWithLichessConnection,
  useAuthenticatedUserWithLichessAccount,
} from 'src/services/Authentication';
import { useLichessGameActions } from './hooks/useLichessGameActions';
import {
  getAwayPlayerFromGameAndAuth,
  getHomePlayerFromGameAndAuth,
  getNumberOfOffersOfType,
  getLastPendingNotificationOfType
} from '../utils';
import { Flag } from 'grommet-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshakeAltSlash, faUndo } from '@fortawesome/free-solid-svg-icons';
import cx from 'classnames';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { Game } from 'src/modules/Games';
import { usePeerState } from 'src/providers/PeerProvider';
import { SocketClient } from 'src/services/socket/SocketClient';
import { gameActionPayloads } from 'src/modules/Games/GameActions/hooks/useGameActions/payloads';
import { useTakebackStatus } from 'src/modules/Games/GameActions';
import { RoomLichessActivity } from 'src/modules/Room/RoomActivity/activities/PlayActivity';

type Props = {
  className?: string;
  game: Game;
  activity: RoomLichessActivity
};

export const LichessGameActions: React.FC<Props> = ({ className, game,activity }) => {
  const cls = useStyles();
  const lichessGameActions = useLichessGameActions();
  const activityLog = useSelector(selectCurrentRoomActivityLog);
  const auth = useAuthenticatedUserWithLichessAccount();
  const dispatch = useDispatch();
  const peerState = usePeerState();
  const [offersState, setOffersState] = useState<{
    draw: number;
  }>({ draw: 0 });
  const {show} = useTakebackStatus(game,
    getHomePlayerFromGameAndAuth(game, auth as RegisteredUserRecordWithLichessConnection),
    activity.offer
    );

  useEffect(() => {
    setOffersState(() => ({
      draw: getNumberOfOffersOfType(activityLog, 'draw'),
    }));
  }, [activityLog]);

  const request: SocketClient['send'] = (payload) => {
    // TODO: Look into what to do if not open!
    // THE ui should actually change and not allow interactions, but ideally
    //  the room still shows!
    // TODO: That should actually be somewhere global maybe!
    if (peerState.status === 'open') {
      peerState.client.sendMessage(payload);
    }
  };

  if (game) {
    return (
      <div className={cx(cls.container, className)}>
        <div className={cls.gameActionButtonsContainer}>
          <ActionButton
            type="primary"
            label="Resign"
            actionType="negative"
            icon={Flag}
            onSubmit={() => {
              lichessGameActions.resignGame();
            }}
            className={cls.gameActionButton}
            disabled={game.state !== 'started'}
          />
          <ActionButton
            type="primary"
            label="Offer Draw"
            confirmation="Confirm"
            actionType="attention"
            iconComponent={<FontAwesomeIcon icon={faHandshakeAltSlash} color="#fff" />}
            onSubmit={() => {
              lichessGameActions.sendDrawOffer();
            }}
            className={cls.gameActionButton}
            disabled={
              offersState.draw === 1 ||
              activityLog.pending?.offerType === 'draw' ||
              game.state !== 'started'
            }
          />
          {
            <ActionButton
              type="primary"
              label="Takeback"
              confirmation="Confirm"
              actionType="attention"
              iconComponent={<FontAwesomeIcon icon={faUndo} color="#fff" />}
              onSubmit={() => {
                lichessGameActions.sendTakebackOffer();
                request(gameActionPayloads.takebackOffer());
                const id = getLastPendingNotificationOfType(activityLog, 'takeback')?.id;
                if (!id) {
                  dispatch(
                    addNotificationAction({
                      notification: {
                        id: new Date().getTime().toString(),
                        timestamp: toISODateTime(new Date()),
                        offerType: 'takeback',
                        type: 'offer',
                        status: 'pending',
                        byUser: getHomePlayerFromGameAndAuth(
                          game,
                          auth as RegisteredUserRecordWithLichessConnection
                        ).user,
                        toUser: getAwayPlayerFromGameAndAuth(
                          game,
                          auth as RegisteredUserRecordWithLichessConnection
                        ).user,
                      },
                    })
                  );
                }
              }}
              className={cls.gameActionButton}
              disabled={
                !show  || game.state !== 'started'
              }
            />
          }
        </div>
      </div>
    );
  }
  return null;
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
  },
  gameActionButtonsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
  },
  gameActionButton: {
    ...({
      '&:last-of-type': {
        marginBottom: '0px !important',
      },
    } as CSSProperties),
  },
  badge: {
    position: 'relative',
    right: '-40%',
    top: '-30%',
  },
});
