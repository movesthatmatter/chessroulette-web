import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionButton, Button } from 'src/components/Button';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { selectGame } from 'src/modules/Room/RoomActivity/redux/selectors';
import { addNotificationAction, resolveOfferNotificationAction } from 'src/modules/Room/RoomActivityLog/redux/actions';
import { selectCurrentRoomActivityLog } from 'src/modules/Room/RoomActivityLog/redux/selectors';
import { RegisteredUserRecordWithLichessConnection, useAuthenticatedUserWithLichessAccount } from 'src/services/Authentication';
import { useLichessGameActions } from '../useLichessGameActions/useLichessGameActions';
import { getAwayPlayerFromGameAndAuth, getHomePlayerFromGameAndAuth, getLastPendingNotificationOfType } from '../utils';
import { Flag} from 'grommet-icons';
import { spacers } from 'src/theme/spacers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshakeAltSlash, faUndo } from '@fortawesome/free-solid-svg-icons';
import cx from 'classnames';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { console } from 'window-or-global';

type Props = {
  className?: string;
};

export const LichessGameActions: React.FC<Props> = (props) => {
  const cls = useStyles();
  const lichessGameActions = useLichessGameActions();
  const game = useSelector(selectGame);
  const activityLog = useSelector(selectCurrentRoomActivityLog);
  const auth = useAuthenticatedUserWithLichessAccount();
  const dispatch = useDispatch();

  const { pending } = activityLog;

  if (game) {
    return (
      <div className={cx(cls.container, props.className)}>
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
          />
          {pending && pending.offerType === 'draw' && pending.byUser.id === auth?.id ? (
            <Button
              label="Cancel Draw Offer"
              type="primary"
              clear
              className={cls.gameActionButton}
              onClick={() => {
                const id = getLastPendingNotificationOfType(activityLog, 'draw');
                if (id) {
                  dispatch(
                    resolveOfferNotificationAction({
                      notificationId: id,
                      status: 'withdrawn',
                    })
                  );
                }
              }}
              style={{
                marginTop: spacers.default,
              }}
            />
          ) : (
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
            />
          )}
          {
            <ActionButton
              type="primary"
              label="Takeback"
              confirmation="Confirm"
              actionType="attention"
              iconComponent={<FontAwesomeIcon icon={faUndo} color="#fff" />}
              onSubmit={() => {
                lichessGameActions.sendTakebackOffer();
                const id = getLastPendingNotificationOfType(activityLog, 'takeback');
                if (!id) {
                  dispatch(addNotificationAction({
                    notification: {
                      id: new Date().getTime().toString(),
                      timestamp: toISODateTime(new Date()),
                      offerType: 'takeback',
                      type: 'offer',
                      status: 'pending',
                      byUser: getHomePlayerFromGameAndAuth(game, auth as RegisteredUserRecordWithLichessConnection),
                      toUser: getAwayPlayerFromGameAndAuth(game, auth as RegisteredUserRecordWithLichessConnection)
                    }
                  }))
                }
              }}
              className={cls.gameActionButton}
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
});
