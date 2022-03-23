import { RelayedGameRecord } from 'chessroulette-io/dist/resourceCollections/relay/records';
import React, { useEffect, useState } from 'react';
import { Button } from 'src/components/Button';
import { Dialog } from 'src/components/Dialog';
import { Text } from 'src/components/Text';
import { createUseStyles, NestedCSSElement } from 'src/lib/jss';
import { noop } from 'src/lib/util';
import { CuratedEvent, CuratedEventRound } from 'src/modules/CuratedEvents/types';
import { Game } from 'src/modules/Games';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { CompactGameListItem } from 'src/modules/Games/Chess/components/GamesList/components/CompactGameListItem';
import { gameRecordToGame, getPlayerByColor } from 'src/modules/Games/Chess/lib';
import { getUserDisplayName } from 'src/modules/User';
import { effects, fonts, softBorderRadius, textShadowDarkMode } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { console } from 'window-or-global';
import { CompactGameListItemForPendingGame } from './CompactGameListItemForPendingGame';

type Props = {
  events: CuratedEvent[];
  title: string;
  onSelectedGame: (g: Game) => void;
};

type CuratedEventGames = {
  eventName: string;
  roundLabel: string;
  game: Game;
};

export const CompactGamesList: React.FC<Props> = ({ events, onSelectedGame, title }) => {
  const cls = useStyles();
  const [games, setGames] = useState<CuratedEventGames[]>(processEventsIntoGames(events));
  const [selectedGame, setSelectedGame] = useState<Game |null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    console.log('events ==> ', events);
    setGames(processEventsIntoGames(events));
  }, [events]);

  function processEventsIntoGames(events: CuratedEvent[]): CuratedEventGames[] {
    return events.reduce((sum, event) => {
      event.rounds.forEach((round) => {
        round.games.forEach((game) => {
          sum.push({
            eventName: event.name,
            roundLabel: round.label,
            game: gameRecordToGame(game),
          });
        });
      });
      return sum;
    }, [] as CuratedEventGames[]);
  }

  return (
    <>
    <div className={cls.container}>
      <Text size="subtitle1">{title} :</Text>
      <br />
      {games.map((game) => (
        <div className={cls.gameContainer}>
          <Text size="small2" className={cls.title}>
            {game.eventName} - {game.roundLabel} :
          </Text>
          <CompactGameListItemForPendingGame game={game.game} />
          {(game.game.state === 'pending' || game.game.state === 'started') && <div className={cls.hovered}>
            <div className={cls.hoveredBkg} />
            <div className={cls.hoveredContent} onClick={() => {
              setSelectedGame(game.game)
              setShowDialog(true)
            }}>
              <Text size="subtitle1" className={cls.selectText}>
                Start Relay
              </Text>
            </div>
          </div>}
          {(game.game.state === 'finished' || game.game.state === 'stopped') && <div className={cls.disabled}>
            <Text size='subtitle1' className={cls.selectText}>GAME FINISHED</Text>
            </div>}
        </div>
      ))}
    </div>
    <Dialog
      visible={showDialog}
      title='Start Relay for selected game?'
      hasCloseButton
      onClose={() => {
        setShowDialog(false);
        setSelectedGame(null);
      }}
      content={
        <div>
          <Text>Are you sure you want to start broadcast the selected game? </Text>
          <div className={cls.buttonsContainer}>
            <Button label='Start' type='positive' onClick={() => {
              if (selectedGame) {
                onSelectedGame(selectedGame)
                setShowDialog(false);
              }
            }}/>
            <div style={{width: spacers.default}}/>
            <Button label='Cancel' type='negative' onClick={() => {
              setSelectedGame(null);
              setShowDialog(false)
            }}
            />
          </div>
        </div>
      }
    />
    </>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    backgroundColor: theme.depthBackground.backgroundColor,
    width: '150px',
    padding: '5px',
    ...softBorderRadius,
  },
  gameContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: spacers.small,
    marginBottom: spacers.default,
    overflow: 'hidden',
    position: 'relative',
    ...effects.softBorderRadius,
    // '&:hover': {
    //   backgroundColor: theme.colors.secondaryLight,
    //   cursor: 'pointer',
    // },
    ...({
      '&:hover > $hovered': {
        display: 'block !important',
      },
    } as NestedCSSElement),
  },
  title: {
    color: theme.colors.primary,
  },
  playerInfo: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignContent: 'left',
    marginTop: '5px',
    marginBottom: '5px',
    ...fonts.small1,
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent:'center',
    marginTop: spacers.default
  },
  hovered: {
    display: 'none',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  hoveredBkg: {
    cursor: 'pointer',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    background: theme.colors.neutralLightest,
    opacity: 0.7,
    zIndex: 98,
  },
  hoveredContent: {
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,

    color: theme.colors.black,
  },
  disabled: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    background: theme.colors.neutralLightest,
    opacity: 0.7,
    zIndex: 98,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  selectText: {
    ...(theme.name === 'darkDefault' ? textShadowDarkMode : {}),
  },
}));
