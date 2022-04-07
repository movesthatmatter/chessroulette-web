import React, { useCallback, useEffect, useState } from 'react';
import { RegisteredUserRecord } from 'chessroulette-io';
import { Page } from 'src/components/Page';
import { RelativeLink } from 'src/components/RelativeLink';
import { playTournamentMatch } from '../resources';
import { TournamentMatchRecord } from '../types';
import { useResource } from 'src/lib/hooks/useResource';
import { TournamentInProgressMatchPage } from '../TournamentInProgressMatchPage';
import { AwesomeLoader } from 'src/components/AwesomeLoader';
import { isDateInThePast } from 'src/modules/Room/util';
import { setInterval } from 'window-or-global';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { fonts, hardBorderRadius } from 'src/theme';
import { Text } from 'src/components/Text';
import dateformat from 'dateformat';
import { ISODateTimeBrand } from 'io-ts-isodatetime/dist/lib/ISODateTime';
import { Avatar } from 'src/components/Avatar';
import { getUserDisplayName } from 'src/modules/User';
import whitePiece from '../assets/white_piece.svg';
import blackPiece from '../assets/black_piece.svg';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { colors } from 'src/theme/colors';

type Props = {
  match: TournamentMatchRecord;
  user: RegisteredUserRecord;
};

export const TournamentMatchPage: React.FC<Props> = ({ match: givenMatch, user }) => {
  const [match, setMatch] = useState(givenMatch);
  const playTournamentMatchResource = useResource(playTournamentMatch);
  const [countDown, setCountdown] = useState(10);
  const cls = useStyles();
  const { theme } = useColorTheme();

  useEffect(() => {
    setMatch(givenMatch);
  }, [givenMatch]);

  const playMatch = useCallback(() => {
    if (playTournamentMatchResource.isLoading) {
      return;
    }

    playTournamentMatchResource
      .request({
        tournamentId: match.tournamentId,
        matchId: match.id,
      })
      .map(setMatch);
  }, [match, playTournamentMatchResource.isLoading]);

  useEffect(() => {
    if (match.state === 'underway' && isDateInThePast(match.underwayAt)) {
      setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000 * 1);
      // playMatch();
    }
  }, [match.state]);

  useEffect(() => {
    if (countDown < 1) {
      playMatch();
    }
  }, [countDown]);

  if (match.state === 'inProgress') {
    return <TournamentInProgressMatchPage match={match} />;
  }

  function getDisplayDate(): string {
    if (match.state === 'complete') {
      return dateformat(match.completedAt, 'dd mmmm - h:MM:ss TT');
    }
    if (match.state === 'underway') {
      return dateformat(match.underwayAt, 'dd mmmm - h:MM:ss TT');
    }
    if (match.state === 'inProgress') {
      return dateformat(match.startedAt, 'dd mmmm - h:MM:ss TT');
    }
    return dateformat(match.scheduledAt, 'dd mmmm - h:MM:ss TT');
  }

  return (
    <Page name="Tournament Match">
      <div className={cls.container}>
        <div className={cls.round}>
          <Text
            size="body1"
            style={{ fontStyle: 'italic', fontWeight: 'bold' }}
          >{`Round ${match.round}`}</Text>
        </div>
        <div className={cls.matchContainer}>
          <div className={cls.date}>
            <Text size="small2">{getDisplayDate()}</Text>
          </div>
          <div className={cls.scoreAndPlayerContainer}>
            <div
              className={cls.playerContainer}
              style={{
                background:
                  theme.name === 'darkDefault'
                    ? 'linear-gradient(270deg, #2D3247 0%, rgba(45, 50, 71, 0) 100%)'
                    : 'linear-gradient(90deg, #5FD8F9 -6.15%, #BE6ED9 100%)',
                paddingLeft: spacers.large,
              }}
            >
              <div
                className={cls.avatar}
                style={{
                  left: '0px',
                }}
              >
                {match.players && (
                  <Avatar hasBorder size={75} mutunachiId={+match.players[0].user.avatarId} />
                )}
              </div>
              <div
                className={cls.playerName}
                style={{
                  paddingLeft: '80px',
                  paddingRight: spacers.large,
                }}
              >
                {match.players && (
                  <Text
                    size="largeNormal"
                    style={{
                      ...(match.winner === 'white' && {
                        color:
                          theme.name === 'darkDefault'
                            ? theme.colors.primary
                            : theme.colors.primaryHover,
                        fontWeight: 900,
                      }),
                    }}
                  >
                    {getUserDisplayName(match.players[0].user)}
                  </Text>
                )}
              </div>
              <div
                className={cls.piece}
                style={{
                  paddingRight: spacers.default,
                }}
              >
                <img src={whitePiece} alt="whitePiece" width="18px" />
              </div>
            </div>
            <div className={cls.scoreContainer}>
              <div className={cls.scoreLeftSide}>
                <Text
                  size="largeNormal"
                  style={{
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                  }}
                >
                  {match.state === 'complete'
                    ? match.winner === 'white' || match.winner === '1/2'
                      ? '1'
                      : '0'
                    : '0'}
                </Text>
              </div>
              <div className={cls.scoreRightSide}>
                <Text
                  size="largeNormal"
                  style={{
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                  }}
                >
                  {match.state === 'complete'
                    ? match.winner === 'black' || match.winner === '1/2'
                      ? '1'
                      : '0'
                    : '0'}
                </Text>
              </div>
            </div>
            <div
              className={cls.playerContainer}
              style={{
                background:
                  theme.name === 'darkDefault'
                    ? 'linear-gradient(90deg, #2D3247 0%, rgba(45, 50, 71, 0) 100%)'
                    : 'linear-gradient(270deg, #5FD8F9 -6.15%, #BE6ED9 100%)',
                paddingRight: spacers.large,
              }}
            >
              <div
                className={cls.piece}
                style={{
                  paddingLeft: spacers.default,
                }}
              >
                <img src={blackPiece} alt="blackPiece" width="18px" />
              </div>
              <div
                className={cls.playerName}
                style={{
                  paddingRight: '80px',
                  paddingLeft: spacers.large,
                }}
              >
                {match.players && (
                  <Text
                    size="largeNormal"
                    style={{
                      ...(match.winner === 'black' && {
                        color:
                          theme.name === 'darkDefault'
                            ? theme.colors.primary
                            : theme.colors.primaryHover,
                        fontWeight: 900,
                      }),
                    }}
                  >
                    {getUserDisplayName(match.players[1].user)}
                  </Text>
                )}
              </div>
              <div
                className={cls.avatar}
                style={{
                  right: '0px',
                }}
              >
                {match.players && (
                  <Avatar hasBorder size={75} mutunachiId={+match.players[1].user.avatarId} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {match.state == 'underway' && <Button label="Play" onClick={playMatch} />} */}
      {/* {match.state == 'complete' && <RelativeLink to="/analysis">Analyze</RelativeLink>}
      {match.state === 'underway' && <pre>{countDown} to play</pre>}*/}
      {playTournamentMatchResource.isLoading && <AwesomeLoader />}
    </Page>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  round: {
    marginBottom: spacers.large,
    display: 'flex',
    justifyContent: 'center',
  },
  matchContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  date: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: spacers.larger,
  },
  scoreAndPlayerContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreContainer: {
    minWidth: '60px',
    padding: spacers.small,
    display: 'flex',
    color: theme.text.baseColor,
  },
  playerContainer: {
    ...hardBorderRadius,
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    height: '45px',
    minWidth: '20rem',
  },
  avatar: {
    position: 'absolute',
    top: '-20px',
  },
  playerName: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.universal.white,
  },
  piece: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreLeftSide: {
    background:
      theme.name === 'darkDefault' ? theme.colors.neutralDark : theme.colors.primaryLightest,
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
    borderRight: `1px solid ${theme.colors.background}`,
    display: 'flex',
  },
  scoreRightSide: {
    display: 'flex',
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
    background:
      theme.name === 'darkDefault' ? theme.colors.neutralDark : theme.colors.primaryLightest,
    borderLeft: `1px solid ${theme.colors.background}`,
  },
}));
