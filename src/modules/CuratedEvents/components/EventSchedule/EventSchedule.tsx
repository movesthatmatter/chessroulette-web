import { RelayedGameRecord } from 'dstnd-io/dist/resourceCollections/relay/records';
import React, { useMemo, useState } from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { gameRecordToGame } from 'src/modules/Games/Chess/lib';
import { ChessGameDisplay } from 'src/modules/Games/widgets/ChessGameDisplay';
import { StreamerGallery } from 'src/modules/Live/components/StreamerGallery/StreamerGallery';
import { CreateRoomButtonWidgetFromSpecs } from 'src/modules/Room/widgets/CreateRoomWidget';
import { spacers } from 'src/theme/spacers';
import { EventStatsWidget } from '../../EventStatsWidget/EventStatsWidget';
import { CuratedEvent, CuratedEventRound } from '../../types';
import { EventRound } from './EventRound';
import { getInitialFocusedRound } from './util';
import { ScrollableList } from 'src/components/ScrollableList';

type Props = {
  event: CuratedEvent;
};

export const EventSchedule: React.FC<Props> = ({ event }) => {
  const cls = useStyles();
  const [selectedRound, setSelectedRound] = useState<CuratedEventRound | undefined>(
    getInitialFocusedRound(event)
  );

  const focusedGame = useMemo(() => {
    if (!selectedRound) {
      return undefined;
    }

    const [firstGame, ...restGames] = selectedRound.games;

    if (!firstGame) {
      return undefined;
    }

    return gameRecordToGame(firstGame);
  }, [selectedRound]);

  const commentatorsList = useMemo(() => {
    if (!selectedRound) {
      return undefined;
    }

    return Object.values(selectedRound.commentators);
  }, [selectedRound]);

  const onLoadGame = (r: RelayedGameRecord) => {};
  const onWatchGame = (r: RelayedGameRecord) => {};

  return (
    <div className={cls.container}>
      <div className={cls.leftSide}>
        <Text size="title2">{event.name} Schedule</Text>
        <div style={{ height: spacers.large }} />
        <ScrollableList
          className={cls.roundsList}
          items={event.rounds.map((round) => ({
            id: round.id,
            content: (
              <EventRound
                round={round}
                active={selectedRound?.id === round.id}
                onSelect={setSelectedRound}
                onLoadGame={onLoadGame}
                onWatchNow={onWatchGame}
              />
            ),
          }))}
        />
      </div>
      <div className={cls.main}>
        {focusedGame && (
          <div className={cls.gameContainer}>
            <ChessGameDisplay
              game={focusedGame}
              hoveredComponent={
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 99,
                  }}
                >
                  <CreateRoomButtonWidgetFromSpecs
                    label="Analyze"
                    type="primary"
                    createRoomSpecs={{
                      activity: {
                        activityType: 'analysis',
                        source: 'archivedGame',
                        gameId: focusedGame.id,
                      },
                      type: 'private',
                    }}
                  />
                </div>
              }
            />
          </div>
        )}
      </div>
      <div className={cls.rightSide}>
        <Text size="title2">Leaderboard</Text>
        <div style={{ height: spacers.large }} />
        <EventStatsWidget event={event} className={cls.statsScrollableList} />
        <br />

        {commentatorsList && (
          <div className={''}>
            <Text size="subtitle1">Covered By</Text>
            <br />
            <StreamerGallery streamers={commentatorsList} compact />
          </div>
        )}
        {/* <StreamsReel streamers={commentatorsList} /> */}
      </div>
    </div>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    display: 'flex',
    flex: 1,
  },
  leftSide: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0.6,
  },
  main: {
    flex: 1,
  },
  gameContainer: {
    paddingRight: spacers.get(2),
    paddingLeft: spacers.get(2),
  },
  board: {},
  rightSide: {
    flex: 0.56,
  },

  roundsList: {
    overflow: 'visible',
  },

  statsScrollableList: {
    height: '156px',
  },
}));
