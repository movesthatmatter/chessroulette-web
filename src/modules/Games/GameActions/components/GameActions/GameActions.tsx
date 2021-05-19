import { ChessGameState, ChessPlayer, RoomPlayActivityRecord } from 'dstnd-io';
import React from 'react';
import { ActionButton, Button } from 'src/components/Button';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { Refresh, Flag, Edit } from 'grommet-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshakeAltSlash } from '@fortawesome/free-solid-svg-icons';
import cx from 'classnames';
import { getOppositePlayer } from 'src/modules/GameRoomV2/util';
import { useGameActions } from '../../hooks/useGameActions';
import { spacers } from 'src/theme/spacers';
import { ConfirmNewGameAction } from '../ConfirmNewGameAction';
import { getUserDisplayName } from 'src/modules/User';
import { noop } from 'src/lib/util';


type Props = {
  myPlayer: ChessPlayer;
  game: ChessGameState;
  roomActivity: RoomPlayActivityRecord;
  className?: string;
  isMobile?: boolean;
  onActionTaken?: (a: keyof ReturnType<typeof useGameActions>) => void;
};

export const GameActions: React.FC<Props> = ({
  game,
  myPlayer,
  isMobile = false,
  onActionTaken = noop,
  ...props
}) => {
  const cls = useStyles();

  const actions = useGameActions();

  // TODO: Start using the useGameActions hook!

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

    const otherPlayer = getOppositePlayer(myPlayer, game.players);

    if (!otherPlayer) {
      return null;
    }

    if (game.state === 'finished' || game.state === 'stopped' || game.state === 'neverStarted') {
      return (
        <>
          {(props.roomActivity.offer?.type === 'rematch' ||
            props.roomActivity.offer?.type === 'challenge') &&
          props.roomActivity.offer?.content.byUser.id === myPlayer.user.id ? (
            <Button
              label={
                props.roomActivity.offer.type === 'rematch' ? 'Cancel Rematch' : 'Cancel Challenge'
              }
              type="primary"
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
            <ConfirmNewGameAction
              title="Rematch"
              content={{
                __html: `Challenge <strong>${getUserDisplayName(
                  otherPlayer.user
                )}</strong> to a Rematch or create a New Game below`,
              }}
              submitButton={(p) =>
                p.isRematchable
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
                if (isRematchable) {
                  actions.onRematchOffer({ gameSpecs });
                  onActionTaken('onRematchOffer');
                } else {
                  actions.onOfferChallenge({ gameSpecs, toUserId: otherPlayer.user.id });
                  onActionTaken('onOfferChallenge');
                }
              }}
              render={(p) => (
                <ActionButton
                  type="primary"
                  label="Rematch"
                  confirmation="Rematch"
                  actionType="positive"
                  icon={Refresh}
                  disabled={props.roomActivity.offer?.type === 'rematch'}
                  onFirstClick={p.onConfirm}
                  onSubmit={() => {}}
                  className={cls.gameActionButton}
                  {...dynamicProps}
                />
              )}
            />
          )}
        </>
      );
    }

    if (game.state === 'pending') {
      return (
        <>
          {props.roomActivity.offer?.type === 'challenge' &&
          props.roomActivity.offer?.content.byUser.id === myPlayer.user.id ? (
            <Button
              label="Cancel"
              type="primary"
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
            <ConfirmNewGameAction
              title="Edit Game"
              content={{
                __html: `Create a new game with <strong>${getUserDisplayName(
                  otherPlayer.user
                )}</strong>`,
              }}
              submitButton={{
                label: 'Submit',
                type: 'primary',
              }}
              onSubmit={({ gameSpecs }) => {
                actions.onOfferChallenge({ gameSpecs, toUserId: otherPlayer.user.id });
                onActionTaken('onOfferChallenge');
              }}
              render={(p) => (
                <ActionButton
                  type="primary"
                  label="Edit Game"
                  actionType="positive"
                  confirmation="Edit Game"
                  icon={Edit}
                  onFirstClick={p.onConfirm}
                  onSubmit={() => {}}
                  className={cls.gameActionButton}
                  {...dynamicProps}
                />
              )}
            />
          )}
        </>
      );
    }

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
          {props.roomActivity.offer?.type === 'draw' &&
          props.roomActivity.offer?.content.byUser.id === myPlayer.user.id ? (
            <Button
              label="Cancel Draw Offer"
              type="primary"
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
              iconComponent={<FontAwesomeIcon icon={faHandshakeAltSlash} color="#fff" />}
              onSubmit={() => {
                actions.onOfferDraw();
                onActionTaken('onOfferDraw');
              }}
              disabled={props.roomActivity.offer?.type === 'draw'}
              className={cls.gameActionButton}
              {...dynamicProps}
            />
          )}
        </>
      );
    }

    return null;
  };

  return (
    <div className={cx(cls.container, props.className)}>
      <div className={cls.gameActionButtonsContainer}>{content()}</div>
    </div>
  );
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
