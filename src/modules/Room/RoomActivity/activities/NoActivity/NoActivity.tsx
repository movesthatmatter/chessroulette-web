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
import { Button } from 'src/components/Button';
import { spacers } from 'src/theme/spacers';
import { CreateChallengeButton } from '../components/CreateChallengeButton';

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
            overlayComponent={
              pendingChallenge && <PendingChallengeDialog pendingChallenge={pendingChallenge} />
            }
          />
        )}
      />
    );
  }

  return (
    <GenericLayoutDesktopRoomConsumer
      renderActivity={({ boardSize, leftSide }) => (
        <div className={cls.container}>
          <aside className={cls.side} style={{ height: boardSize, width: leftSide.width }}>
            <div className={cls.sideTop} />
            <div className={cls.buttons}>
              <Button
                label="Open Analysis"
                onClick={() => {
                  if (roomConsumer) {
                    roomConsumer.roomActions.switchActivity({
                      activityType: 'analysis',
                      history: [],
                    });
                  }
                }}
                className={cls.roomButton}
                full
                clear
                withBadge={{
                  text: 'New',
                  side: 'right',
                  color: 'negativeLight',
                }}
              />
              {!pendingChallenge && <CreateChallengeButton label="Create Challenge" full />}
            </div>
          </aside>
          <ChessBoard
            type="free"
            size={boardSize}
            id="empty-frozen-board" // TODO: This might need to change
            pgn=""
            homeColor="white"
            canInteract
            onMove={() => {}}
            className={cls.board}
            overlayComponent={
              pendingChallenge && <PendingChallengeDialog pendingChallenge={pendingChallenge} />
            }
          />
        </div>
      )}
    />
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
  },
  sideTop: {
    flex: 1,
  },
  sideContent: {},
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    paddingRight: spacers.get(1.5),
    marginBottom: `-${spacers.default}`,
  },
  roomButton: {},
  lastButton: {
    marginBottom: 0,
  },
});
