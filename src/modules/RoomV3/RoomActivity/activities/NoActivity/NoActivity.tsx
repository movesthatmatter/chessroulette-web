import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, onlySmallMobile, softBorderRadius } from 'src/theme';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { GenericLayoutDesktopRoomConsumer } from '../../../RoomConsumers/GenericLayoutDesktopRoomConsumer';
import { GenericLayoutMobileRoomConsumer } from '../../../RoomConsumers/GenericLayoutMobileRoomConsumer';
import { DeviceSize } from 'src/theme/hooks/useDeviceSize';
import { NavigationHeader } from 'src/modules/Room/LayoutProvider/RoomLayoutProvider/components/NavigationHeader';

type Props = {
  deviceSize: DeviceSize;
};

export const NoActivity: React.FC<Props> = (props) => {
  const cls = useStyles();

  if (props.deviceSize.isMobile) {
    return (
      <GenericLayoutMobileRoomConsumer
        renderTopOverlayHeader={() => <NavigationHeader darkMode />}
        // renderTopOverlayMain={() => (
        //   <div
        //     className={cls.iconButtonsContainer}
        //     style={{
        //       position: 'absolute',
        //       bottom: 0,
        //       left: 0,
        //       right: 0,
        //     }}
        //   >
        //     {/* <MobileChatWidgetRoomConsumer containerHeight={dimensions.mainAreaContainer.height} /> */}
        //   </div>
        // )}
        // Account for the rounded border
        // renderTopOverlayFooter={() => <div style={{ height: '16px' }} />}
        renderActivity={(cd) => (
          <ChessBoard
            size={cd.boardSize}
            id="empty-frozen-board" // TODO: This might need to change
            pgn=""
            homeColor="white"
            onMove={() => {}}
            className={cls.board}
          />
        )}
      />
    );
  }

  return (
    <GenericLayoutDesktopRoomConsumer
      renderActivity={(cd) => (
        <ChessBoard
          size={cd.boardSize}
          id="empty-frozen-board" // TODO: This might need to change
          pgn=""
          homeColor="white"
          onMove={() => {}}
          className={cls.board}
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
