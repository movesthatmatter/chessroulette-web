import { ChessGameState, RoomActivityRecord, RoomPlayActivityRecord } from 'dstnd-io';
import React from 'react';
import { ActionButton } from 'src/components/Button';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { Refresh, Halt, Flag, Split } from 'grommet-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandsHelping, faHandHolding, faHandshake, faHandshakeAltSlash } from '@fortawesome/free-solid-svg-icons';
import cx from 'classnames';

type Props = {
  game: ChessGameState;
  roomActivity: RoomPlayActivityRecord;
  onRematchOffer: () => void;
  onAbort: () => void;
  onResign: () => void;
  onOfferDraw: () => void;
  className?: string;

  isMobile?: boolean;
};

export const GameActions: React.FC<Props> = ({ game, isMobile = false, ...props }) => {
  const cls = useStyles();

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

    // const currentOffer = props.roomActivity.type === 'play'
    //   ? 
    //   : undefined;

    if (game.state === 'finished' || game.state === 'stopped' || game.state === 'neverStarted') {
      return (
        <ActionButton
          type="primary"
          label="Rematch"
          actionType="positive"
          icon={Refresh}
          onSubmit={() => props.onRematchOffer()}
          className={cls.gameActionButton}
          disabled={props.roomActivity.offer?.type === 'rematch'}
          {...dynamicProps}
        />
      );
    }

    // if (game.state === 'pending') {
    //   return (
    //     <ActionButton
    //       type="primary"
    //       label="Abort"
    //       actionType="negative"
    //       icon={Halt}
    //       onSubmit={() => props.onAbort()}
    //       className={cls.gameActionButton}
    //       {...dynamicProps}
    //     />
    //   );
    // }

    if (game.state === 'started') {
      return (
        <>
          <ActionButton
            type="primary"
            label="Resign"
            actionType="negative"
            icon={Flag}
            onSubmit={() => props.onResign()}
            className={cls.gameActionButton}
            {...dynamicProps}
          />
          <ActionButton
            type="primary"
            label="Offer Draw"
            actionType="positive"
            iconComponent={<FontAwesomeIcon icon={faHandshakeAltSlash} color="#fff" />}
            onSubmit={() => props.onOfferDraw()}
            disabled={props.roomActivity.offer?.type === 'draw'}
            className={cls.gameActionButton}
            {...dynamicProps}
          />
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
