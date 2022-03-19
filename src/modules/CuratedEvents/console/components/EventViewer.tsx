import React from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { CompactGameListItemForPendingGame } from 'src/modules/Relay/RelayInput/components/CompactGameListItemForPendingGame';
import { spacers } from 'src/theme/spacers';
import { CuratedEvent } from '../../types';
import dateformat from 'dateformat';
import { ConfirmButton } from 'src/components/Button/ConfirmButton';

type Props = {
  event: CuratedEvent;
  onDeleteRound: (id: string) => void;
};

export const EventViewer: React.FC<Props> = ({ event, onDeleteRound }) => {
  const cls = useStyles();
  return (
    <div className={cls.container}>
      <Text>Name: {event.name}</Text>
      <Text>Type: {event.type}</Text>
      <Text>slug: {event.slug}</Text>
      <Text>Rounds: </Text>
      <div className={cls.rounds}>
        {event.rounds.map((round) => (
          <div
            style={{
              maxWidth: '400px',
              display: 'flex',
              flexDirection: 'column',
              marginBottom: spacers.large,
            }}
          >
            <Text>Label: {round.label}</Text>
            <Text>Games: </Text>
            <div className={cls.games}>
              {round.games.map((game) => (
                <div>
                  <CompactGameListItemForPendingGame game={game} containerClassName={cls.game} />
                </div>
              ))}
            </div>
            <Text>Date starting: {dateformat(round.startingAt, 'dd-mm-yyyy')}</Text>
            <Text>Commentators: </Text>
            <Text>
              {round.commentators.map((c) => (
                <span style={{ marginRight: spacers.small }}>
                  {c.profileUrl}
                  {', '}
                </span>
              ))}
            </Text>
            <ConfirmButton
              onConfirmed={() => onDeleteRound(round.id)}
              buttonProps={{
                label: 'Delete Round',
                type: 'negative',
              }}
              dialogProps={{
                title: 'Delete Round?',
                content: 'Are you sure you want to delete this round and all its games?',
                buttonsStacked: false,
              }}
              cancelButtonProps={{
                label: 'Cancel',
                type: 'secondary',
              }}
              confirmButtonProps={{
                label: 'Yes',
                type: 'negative',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  rounds: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: spacers.large,
  },
  games: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: spacers.largest,
  },
  game: {
    backgroundColor: theme.colors.neutralLight,
  },
}));
