import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, softBorderRadius } from 'src/theme';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { console } from 'window-or-global';
import { RoomAnalysisActivity } from './types';
import { spacers } from 'src/theme/spacers';
import { Button } from 'src/components/Button';
import { useDispatch } from 'react-redux';
import { switchRoomActivityAction } from '../redux/actions';

type Props = {
  activity: RoomAnalysisActivity;
  // deprecate in favor of the Layout
  size: number;
};

export const AnalysisActivity: React.FC<Props> = ({ activity, size: boardSize }) => {
  const cls = useStyles();
  const disaptch = useDispatch();

  return (
    <div className={cls.container}>
      <aside className={cls.side} style={{ height: boardSize }}>
        <div className={cls.sideTop}>
          <Button
            label="Play"
            onClick={() => {
              disaptch(
                switchRoomActivityAction({
                  type: 'play',
                  // gameId: '12323',
                })
              );
            }}
          />
        </div>
        <div style={{ height: '40%' }} />
      </aside>
      <ChessBoard
        size={boardSize}
        id="analysis-board" // TODO: This might need to change
        pgn=""
        homeColor="white"
        onMove={(m) => {
          console.log('on move', m);
        }}
        className={cls.board}
      />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
  },
  board: {
    ...floatingShadow,
    ...softBorderRadius,
    overflow: 'hidden',
  },
  side: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginRight: spacers.large,
  },
  sideTop: {
    height: '30%',
  },
  sideMiddle: {
    height: '40%',
  },
  sideBottom: {
    height: '30%',
  },
});
