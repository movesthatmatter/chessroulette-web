import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, onlySmallMobile, softBorderRadius } from 'src/theme';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { GenericLayoutDesktopRoomConsumer } from '../../../RoomConsumers/GenericLayoutDesktopRoomConsumer';
import { GenericLayoutMobileRoomConsumer } from '../../../RoomConsumers/GenericLayoutMobileRoomConsumer';
import { DeviceSize } from 'src/theme/hooks/useDeviceSize';
import { ActivityCommonProps } from '../types';
import { NavigationHeader } from 'src/modules/Room/Layouts';
import { useRoomConsumer } from 'src/modules/Room/RoomConsumers/useRoomConsumer';
import { PendingChallengeDialog } from './components/PendingChallengeDialog';
import { AcceptChallengeDialog } from './components/AcceptChallengeDialog';
import { Button } from 'src/components/Button';
import { spacers } from 'src/theme/spacers';
import { CreateChallengeButton } from '../components/CreateChallengeButton';
import { SwitchActivityWidgetRoomConsumer } from 'src/modules/Room/RoomConsumers/SwitchActivityWidgetRoomConsumer';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';

type Props = ActivityCommonProps & {
  deviceSize: DeviceSize;
};

export const NoActivity: React.FC<Props> = (props) => {
  const cls = useStyles();
  const roomConsumer = useRoomConsumer();
  const [acceptChallengeDialogDismissed, setAccepdChallengeDialogDismissed] = useState(false);
  const {theme} = useColorTheme();

  const pendingChallenge = roomConsumer?.room?.pendingChallenges
    ? Object.values(roomConsumer.room.pendingChallenges)[0]
    : undefined;

  const overlayComponent = (() => {
    if (pendingChallenge) {
      if (pendingChallenge.createdByUser.id === roomConsumer?.room.me.id) {
        return <PendingChallengeDialog pendingChallenge={pendingChallenge} />;
      }

      if (!acceptChallengeDialogDismissed) {
        return (
          <AcceptChallengeDialog
            pendingChallenge={pendingChallenge}
            onDismiss={() => setAccepdChallengeDialogDismissed(true)}
          />
        );
      }
    }

    return undefined;
  })();

  if (props.deviceSize.isMobile) {
    return (
      <GenericLayoutMobileRoomConsumer
        renderTopOverlayHeader={() => <NavigationHeader darkBG />}
        renderActivity={(cd) => (
          <div className={cls.mobileBoardWrapper}>
          <ChessBoard
            type="free"
            size={cd.boardSize}
            id="empty-frozen-board" // TODO: This might need to change
            pgn=""
            homeColor="white"
            onMove={() => {}}
            className={cls.board}
            overlayComponent={overlayComponent}
          />
          </div>
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
            <SwitchActivityWidgetRoomConsumer
              render={({ roomActions }) => (
                <div className={cls.buttons}>
                  <Button
                    label="Open Analysis"
                    onClick={() => {
                      roomActions.switchActivity({
                        activityType: 'analysis',
                        history: [],
                      });
                    }}
                    className={cls.roomButton}
                    full
                    clear
                    withBadge={{
                      text: 'New',
                      side: 'right',
                      color: theme.name ==='lightDefault' ? 'negative' : 'white',
                    }}
                  />
                  {!pendingChallenge && <CreateChallengeButton label="Create Challenge" full />}
                </div>
              )}
            />
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
            overlayComponent={overlayComponent}
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
  mobileBoardWrapper: {
    padding: '6px 12px 8px',

    ...onlySmallMobile({
      paddingLeft: '30px',
      paddingRight: '30px',
    }),
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
