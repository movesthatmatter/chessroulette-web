import React from 'react';
import cx from 'classnames';
import { ActionButton, Button } from 'src/components/Button';
import { createUseStyles, CSSProperties, makeImportant } from 'src/lib/jss';
import { Refresh, Flag, Edit } from 'grommet-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake, faUndo } from '@fortawesome/free-solid-svg-icons';
import { spacers } from 'src/theme/spacers';
import { noop } from 'src/lib/util';
import { getUserDisplayName } from 'src/modules/User';
import { useGameActions } from '../../hooks/useGameActions';
import { ConfirmNewGameAction } from '../ConfirmNewGameAction';
import { useTakebackStatus } from '../../hooks';
import {
  roomPlayActivityParticipantToChessPlayer,
  RoomPlayActivityWithGameAndParticipating,
} from 'src/modules/Room/RoomActivity/activities/PlayActivity';
import { getParticipantUserInfo } from 'src/modules/Room/RoomActivity/util/util';
import { colors } from 'src/theme/colors';

type Props = {
  activity: RoomPlayActivityWithGameAndParticipating;
  className?: string;
  isMobile?: boolean;
  onActionTaken?: (a: keyof ReturnType<typeof useGameActions>) => void;
};

export const GameActions: React.FC<Props> = ({
  activity,
  isMobile = false,
  onActionTaken = noop,
  ...props
}) => {
  const cls = useStyles();
  const actions = useGameActions();
  const { game, offer, participants } = activity;
  const myPlayer = roomPlayActivityParticipantToChessPlayer(participants.me);
  const takebackSatus = useTakebackStatus(game, myPlayer, offer);

  // Ensure the Game Actions don't show if not participating
  if (!activity.iamParticipating) {
    return null;
  }

  const content = () => {
    const dynamicProps = isMobile
      ? {
          full: true,
          hideLabelUntilHover: false,
          reverse: false,
        }
      : {
          full: false,
          hideLabelUntilHover: true,
          reverse: true,
        };

    if (game.state === 'started') {
      return (
        <>
          <ActionButton
            type="primary"
            label="Resign"
            actionType="negative"
            icon={Flag}
            onSubmit={() => {
              actions.onResign();
              onActionTaken('onResign');
            }}
            className={cls.gameActionButton}
            {...dynamicProps}
          />
          {offer?.type === 'draw' && offer?.content.byUser.id === participants.me.userId ? (
            <Button
              label="Cancel Draw Offer"
              type="negative"
              clear
              className={cls.gameActionButton}
              onClick={() => {
                actions.onOfferCanceled();
                onActionTaken('onOfferCanceled');
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
              iconComponent={<FontAwesomeIcon icon={faHandshake} color={colors.universal.white} />}
              onSubmit={() => {
                actions.onOfferDraw();
                onActionTaken('onOfferDraw');
              }}
              disabled={offer?.type === 'draw'}
              className={cls.gameActionButton}
              {...dynamicProps}
            />
          )}
          {takebackSatus.show && (
            <ActionButton
              type="primary"
              label="Takeback"
              confirmation="Confirm"
              actionType="attention"
              iconComponent={<FontAwesomeIcon icon={faUndo} color={colors.universal.white} />}
              onSubmit={() => {
                actions.onTakebackOffer();
                onActionTaken('onTakebackOffer');
              }}
              disabled={offer?.type === 'takeback'}
              className={cls.gameActionButton}
              {...dynamicProps}
            />
          )}
        </>
      );
    } else {
      return (
        <ConfirmNewGameAction
          // This is needed in order to reset the state if the Dialog already opened
          //  but another offer just came in. This ensures the client is not able to send
          //  2 notifications at the same time.
          //  TODO: But the server should take care of that as well
          key={offer?.id}
          title={game.state === 'pending' ? 'Edit Game' : 'Rematch'}
          content={{
            __html: `Challenge <strong>${getUserDisplayName(
              getParticipantUserInfo(participants.opponent.participant)
            )}</strong> to a Rematch or create a New Game below`,
          }}
          prevGameSpecs={{
            timeLimit: game.timeLimit,
            preferredColor: participants.opponent.color,
          }}
          submitButton={(p) =>
            p.isRematchable && game.state !== 'pending'
              ? {
                  label: 'Rematch',
                  type: 'positive',
                }
              : {
                  label: 'New Game',
                  type: 'primary',
                }
          }
          onSubmit={({ gameSpecs, isRematchable }) => {
            if (isRematchable && game.state !== 'pending') {
              actions.onRematchOffer({ gameSpecs });
              onActionTaken('onRematchOffer');
            } else {
              actions.onOfferChallenge({ gameSpecs, toUserId: participants.opponent.userId });
              onActionTaken('onOfferChallenge');
            }
          }}
          render={(p) => (
            <ActionButton
              type="primary"
              label={game.state === 'pending' ? 'Edit Game' : 'Rematch'}
              // confirmation="Rematch"
              actionType="positive"
              icon={game.state === 'pending' ? Edit : Refresh}
              disabled={offer?.type === 'rematch' || offer?.type === 'challenge'}
              onFirstClick={p.onConfirm}
              onSubmit={noop}
              className={cls.gameActionButton}
              {...dynamicProps}
            />
          )}
        />
      );
    }
  };

  return (
    <div className={cx(cls.container, props.className)}>
      <div className={cls.gameActionButtonsContainer}>{content()}</div>
    </div>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    display: 'flex',
  },
  gameActionButtonsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 99,
  },
  gameActionButton: {
    ...makeImportant({
      color: theme.colors.black,
    }),
    ...({
      '&:last-of-type': {
        marginBottom: '0px !important',
      },
    } as CSSProperties),
  },
}));
