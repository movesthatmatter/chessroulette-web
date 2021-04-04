import capitalize from 'capitalize';
import { UserRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { ClipboardCopy } from 'src/components/ClipboardCopy';
import { Page } from 'src/components/Page';
import { Paginator } from 'src/components/Paginator/Paginator';
import { createUseStyles } from 'src/lib/jss';
import { useAuthenticatedUser } from 'src/services/Authentication';
import { colors, floatingShadow, fonts } from 'src/theme';
import { getPlayer } from '../GameRoomV2/util';
import { ChessBoard } from '../Games/Chess/components/ChessBoardV2';
import { gameRecordToGame, pgnToFen } from '../Games/Chess/lib';
import { Game } from '../Games/types';
import { getUserGames } from './resources';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChessKnight} from '@fortawesome/free-solid-svg-icons';

type Props = {};

const getGameResult = (game: Game, userId: UserRecord['id']) => {
  if (game.winner === '1/2') {
    return 'Draw';
  }

  const winningColor = game.winner;

  const userPlayer = getPlayer(userId, game.players);

  if (!userPlayer) {
    return `${capitalize(winningColor || '')} Won`;
  }

  if (userPlayer.color === game.winner) {
    return 'Won';
  }

  return 'Lost';
};

export const GamesArchivePage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const user = useAuthenticatedUser();
  const [games, setGames] = useState<Game[]>([]);
  const pageSize = 3;
  const [totalPages, setTotalPages] = useState(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!user) {
      return;
    }
    setIndex(0);
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }
    getUserGames({ 
      userId: user.id,
      pageSize,
      currentIndex: index
    }).map((gameRecords) => {
      setGames(gameRecords.items.map(gameRecordToGame));
      if (totalPages === 0){
        setTotalPages(Math.ceil(gameRecords.itemsTotal / pageSize))
      }
    });
  },[index])
  
  if (!user) {
    return null;
  }
  return (
    <Page>
      <div className={cls.container}>
        <div className={cls.gameContainerWrapper}>
          {games.map((game) => {
            const date = new Date(game.createdAt);
            return (
              <div className={cls.gameContainer} key={game.id}>
                <div className={cls.infoContainer}>
                  <div className={cls.gameTypeAndDate}>
                    <div style={{flex : 1}}>
                    <div className={cls.gameType}>
                      Game Type -
                      <span style={{ fontWeight: 'bold' }}>
                        {capitalize(game.timeLimit)}
                      </span>
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
                    <FontAwesomeIcon icon={faChessKnight} size='lg'
                    color={game.players[0].color}
                    className={game.players[0].color === 'white' ? cls.chessPieceWhite : cls.chessPieceBlack}/>
                    <span
                    className={cls.nameContainer} 
                    style={{fontWeight: game.players[0].color === game.winner ? 'bolder' : 'normal' }}>
                      {game.players[0].user.name}
                    </span>
                    <span className={cls.vs}>
                     {'  '}vs{'  '}
                    </span>
                    <span
                    className={cls.nameContainer}  
                    style={{ fontWeight: game.players[1].color === game.winner ? 'bolder' : 'normal' }}>
                      {game.players[1].user.name}
                    </span>
                    <FontAwesomeIcon icon={faChessKnight} size='lg'
                    color={game.players[1].color}
                    className={game.players[1].color === 'white' ? cls.chessPieceWhite : cls.chessPieceBlack}/>
                  </div>
                  <div
                  className={cls.gameResult}>{getGameResult(game, user.id)}</div>
                </div>
                </div>
                <div className={cls.chessboardContainer}>
                  <ChessBoard
                    fen={pgnToFen(game.pgn || '')}
                    size={200}
                    coordinates={false}
                    viewOnly
                  />
                </div>
              </div>
            );
          })}
        </div>
         <div className={cls.paginatorContainer}>
           <Paginator
            pageSize={pageSize}
            totalPages={totalPages}
            onChangePage={(page) => {
              setIndex(page);
            }}
          />
        </div> 
      </div>
    </Page>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    marginTop:'20px',
  },
  gameContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: `1px solid ${colors.neutralLight}`,
    padding: '16px',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameContainerWrapper: {
    flex: 1,
  },
  gameResult: {
    alignSelf:'center',
    marginTop:'20px'
  },
  paginatorContainer: {
    paddingBottom: '40px',
    display: 'flex',
    justifyContent: 'center',
  },
  infoContainer: {
    display: 'flex',
    flex:1,
  },
  chessboardContainer: {},
  gameTypeAndDate: {
    display: 'flex',
    flexDirection: 'column',
    height:'150px',
  },
  gameType: {
    ...fonts.subtitle1,
  },
  date: {
    ...fonts.small1,
  },
  pgn:{},
  gameDetails:{
    display:'flex',
    flexDirection:'column',
    flex: 1
  },
  opponentsContainer:{
    ...fonts.largeNormal,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  },
  nameContainer:{
    width : '40%',
    textAlign:'center',
  },
  vs: {
    backgroundColor: colors.neutralLight,
    padding:'6px',
    textAlign:'center',
  },
  chessPieceWhite : {
    ...floatingShadow,
    borderRadius:'3px',
    padding:'4px',
    backgroundColor : colors.chessBoardDark
  },
  chessPieceBlack: {
    ...floatingShadow,
    backgroundColor: colors.chessBoardLight,
    borderRadius: '3px',
    padding:'4px'
  }
});