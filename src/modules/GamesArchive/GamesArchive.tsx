import capitalize from 'capitalize';
import { RegisteredUserRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { ClipboardCopy } from 'src/components/ClipboardCopy';
import { Paginator } from 'src/components/Pagination/Paginator';
import { createUseStyles } from 'src/lib/jss';
import { colors, floatingShadow, fonts, softBorderRadius } from 'src/theme';
import { getPlayerColor } from '../GameRoomV2/util';
import { ChessBoard } from '../Games/Chess/components/ChessBoardV2';
import { gameRecordToGame, pgnToFen } from '../Games/Chess/lib';
import { Game } from '../Games/types';
import { getUserGames } from './resources';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessKnight } from '@fortawesome/free-solid-svg-icons';
import { spacers } from 'src/theme/spacers';
import { AwesomeLoader } from 'src/components/AwesomeLoader';
import { getGameResult } from './util';
import { WithPagination } from 'src/components/Pagination';

type Props = {
  userId: RegisteredUserRecord['id'];
  pageSize?: number;
};

export const GamesArchive: React.FC<Props> = ({ userId, pageSize = 1 }) => {
  const cls = useStyles();
  const [games, setGames] = useState<Game[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [exhausted, setExhausted] = useState(false);

  useEffect(() => {
    // Reset the index if when the user changes
    setIndex(0);
  }, [userId]);

  useEffect(() => {
    console.log("use effect runs");
    if (exhausted) {
      console.log("use effect run stopped");
      return;
    }
    
    setLoading(true);

    getUserGames({
      userId,
      pageSize,
      currentIndex: index,
    })
      .map((gameRecords) => {
        setGames(gameRecords.items.map(gameRecordToGame));

        // if (totalPages === 0) {
          console.log('total pages', Math.ceil(gameRecords.itemsTotal / pageSize))
          // setTotalPages(Math.ceil(gameRecords.itemsTotal / pageSize));
        // }
        setTotalPages(Math.ceil(gameRecords.itemsTotal / pageSize));

        // // console.log('left', (index * pageSize) + gameRecords.items.length);
        // // console.log('res', gameRecords.itemsTotal);
        setExhausted((index * pageSize) + gameRecords.items.length === gameRecords.itemsTotal);
        
        setLoading(false);
      })
      // .mapErr(() => {
      //   setLoading(false);
      // });
  }, [index, userId, pageSize, exhausted]);

  if (loading) {
    return <AwesomeLoader />;
  }

  return (
    <div className={cls.container}>
      <div className={cls.gameContainerWrapper}>
        {games.map((game) => {
          const date = new Date(game.createdAt);
          return (
            <div className={cls.gameContainer} key={game.id}>
              <div className={cls.infoContainer}>
                <div className={cls.gameTypeAndDate}>
                  <div style={{ flex: 1 }}>
                    <div className={cls.gameType}>
                      Game Type -
                      <span style={{ fontWeight: 'bold' }}>{capitalize(game.timeLimit)}</span>
                    </div>
                    <div className={cls.date}>
                      {date.toLocaleDateString('en-US') +
                        ' - ' +
                        date.toLocaleString('en-US', {
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                        })}
                    </div>
                  </div>
                  <div className={cls.pgn}>
                    <ClipboardCopy value={game.pgn || ''} />
                  </div>
                </div>
                <div className={cls.gameDetails}>
                  <div className={cls.opponentsContainer}>
                    <FontAwesomeIcon
                      icon={faChessKnight}
                      size="lg"
                      color={game.players[0].color}
                      className={
                        game.players[0].color === 'white'
                          ? cls.chessPieceWhite
                          : cls.chessPieceBlack
                      }
                    />
                    <span
                      className={cls.nameContainer}
                      style={{
                        fontWeight: game.players[0].color === game.winner ? 'bolder' : 'normal',
                      }}
                    >
                      {game.players[0].user.name}
                    </span>
                    <span className={cls.vs}>
                      {'  '}vs{'  '}
                    </span>
                    <span
                      className={cls.nameContainer}
                      style={{
                        fontWeight: game.players[1].color === game.winner ? 'bolder' : 'normal',
                      }}
                    >
                      {game.players[1].user.name}
                    </span>
                    <FontAwesomeIcon
                      icon={faChessKnight}
                      size="lg"
                      color={game.players[1].color}
                      className={
                        game.players[1].color === 'white'
                          ? cls.chessPieceWhite
                          : cls.chessPieceBlack
                      }
                    />
                  </div>
                  <div className={cls.gameResult}>{getGameResult(game, userId)}</div>
                </div>
              </div>
              <div className={cls.chessboardContainer}>
                <ChessBoard
                  fen={pgnToFen(game.pgn || '')}
                  orientation={getPlayerColor(userId, game.players)}
                  size={140}
                  coordinates={false}
                  viewOnly
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className={cls.paginatorContainer}>
        {/* <Paginator
          pageSize={pageSize}
          totalPages={totalPages}
          currentPage={index}
          onChangePage={(page) => {
            // console.log("page changed", page);
            setIndex(page);
          }}
        /> */}
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    // marginTop: '20px',
  },
  gameContainer: {
    display: 'flex',
    flexDirection: 'row',

    // padding: '16px 0',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: colors.white,
    padding: spacers.default,
    marginBottom: spacers.large,
    // borderRadius: borderRadius
    ...softBorderRadius,
    border: `1px solid ${colors.neutral}`,
    ...floatingShadow,

    '&:last-child': {
      // borderBottom: 0,
    },
  },
  gameContainerWrapper: {
    flex: 1,
  },
  gameResult: {
    alignSelf: 'center',
    marginTop: '20px',
  },
  paginatorContainer: {
    paddingBottom: '40px',
    display: 'flex',
    justifyContent: 'center',
  },
  infoContainer: {
    display: 'flex',
    flex: 1,
  },
  chessboardContainer: {},
  gameTypeAndDate: {
    display: 'flex',
    flexDirection: 'column',
    height: '150px',
  },
  gameType: {
    ...fonts.subtitle1,
  },
  date: {
    ...fonts.small1,
  },
  pgn: {},
  gameDetails: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  opponentsContainer: {
    ...fonts.largeNormal,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    width: '40%',
    textAlign: 'center',
  },
  vs: {
    backgroundColor: colors.neutralLight,
    padding: '6px',
    textAlign: 'center',
  },
  chessPieceWhite: {
    ...floatingShadow,
    borderRadius: '3px',
    padding: '4px',
    backgroundColor: colors.chessBoardDark,
  },
  chessPieceBlack: {
    ...floatingShadow,
    backgroundColor: colors.chessBoardLight,
    borderRadius: '3px',
    padding: '4px',
  },
});
