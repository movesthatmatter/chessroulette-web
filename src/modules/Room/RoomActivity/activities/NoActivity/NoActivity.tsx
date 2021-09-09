import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, softBorderRadius } from 'src/theme';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { GenericLayoutDesktopRoomConsumer } from '../../../RoomConsumers/GenericLayoutDesktopRoomConsumer';
import { GenericLayoutMobileRoomConsumer } from '../../../RoomConsumers/GenericLayoutMobileRoomConsumer';
import { DeviceSize } from 'src/theme/hooks/useDeviceSize';
import { ActivityCommonProps } from '../types';
import { NavigationHeader } from 'src/modules/Room/Layouts';
import { useRoomConsumer } from 'src/modules/Room/RoomConsumers/useRoomConsumer';
import { PendingChallengeDialog } from './components/PendingChallengeDialog';

type Props = ActivityCommonProps & {
  deviceSize: DeviceSize;
};

export const NoActivity: React.FC<Props> = (props) => {
  const cls = useStyles();
  const roomConsumer = useRoomConsumer();

  const pendingChallenge = roomConsumer?.room?.pendingChallenges
    ? Object.values(roomConsumer.room.pendingChallenges)[0]
    : undefined;

  if (props.deviceSize.isMobile) {
    return (
      <GenericLayoutMobileRoomConsumer
        renderTopOverlayHeader={() => <NavigationHeader darkMode />}
        renderActivity={(cd) => (
          <ChessBoard
            type="free"
            size={cd.boardSize}
            id="empty-frozen-board" // TODO: This might need to change
            pgn=""
            homeColor="white"
            onMove={() => {}}
            className={cls.board}
            overlayComponent={pendingChallenge && <PendingChallengeDialog pendingChallenge={pendingChallenge} />}
          />
        )}
      />
    );
  }

  return (
    <GenericLayoutDesktopRoomConsumer
      renderActivity={(cd) => (
        <ChessBoard
          type="free"
          size={cd.boardSize}
          id="empty-frozen-board" // TODO: This might need to change
          pgn=""
          homeColor="white"
          onMove={() => {}}
          className={cls.board}
          overlayComponent={pendingChallenge && <PendingChallengeDialog pendingChallenge={pendingChallenge} />}
        />
      )}
    />
  );
};

const useStyles = createUseStyles({
  board: {
    ...floatingShadow,
    ...softBorderRadius,
    overflow: 'hidden',
  },
});
