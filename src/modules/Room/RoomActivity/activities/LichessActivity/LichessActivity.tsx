import React, { useEffect, useState } from 'react';
import { GenericLayoutDesktopRoomConsumer } from 'src/modules/Room/RoomConsumers/GenericLayoutDesktopRoomConsumer';
import { PeerConsumer, usePeerState } from 'src/providers/PeerProvider';
import { RoomLichessActivity } from '../PlayActivity';
import { LichessGameContainer } from 'src/modules/LichessPlay/PlayLichess/LichessGameContainer';
import { useLichessProvider } from 'src/modules/LichessPlay/LichessAPI/useLichessProvider';
import { AwesomeErrorPage } from 'src/components/AwesomeError';
import { AwesomeLoader } from 'src/components/AwesomeLoader';
import { useSelector } from 'react-redux';
import { selectGame } from '../../redux/selectors';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { floatingShadow, softBorderRadius } from 'src/theme';
import { ChessGameColor, GuestUserRecord } from 'dstnd-io';
import { useLichessGameActions } from 'src/modules/LichessPlay/useLichessGameActions/useLichessGameActions';
import { getAwayPlayer } from 'src/modules/LichessPlay/utils';
import { authenticateAsExistentGuest } from 'src/services/Authentication/resources';

type Props = {
  activity: RoomLichessActivity;
};

export const LichessActivity: React.FC<Props> = (props) => {
  const peerState = usePeerState();
  const [homeColor, setHomeColor] = useState<ChessGameColor>('white');
  const gameActions = useLichessGameActions();
  const lichess = useLichessProvider();
  const game = useSelector(selectGame);

  useEffect(() => {
    if (lichess) {
      // This is needed to have a stream open on this page as well in case user refreshes the page - it will get back to the event flow
      lichess.startStream();
    }
  }, []);

  useEffect(() => {
    if (lichess) {
      lichess.onNewGame(({ game, homeColor, player }) => {
        setHomeColor(homeColor);
        gameActions.onJoinedGame(game, player);
        authenticateAsExistentGuest({
          guestUser: getAwayPlayer(homeColor, game).user as GuestUserRecord,
        });
      });
    }
  },[lichess])


  if (peerState.status !== 'open') {
    return null;
  }

  return (
    <PeerConsumer
      renderFallback={(r) => {
        if (r.state === 'error') {
          return <AwesomeErrorPage />;
        }

        return <AwesomeLoader />;
      }}
      renderRoomJoined={() => (
        <GenericLayoutDesktopRoomConsumer
          renderActivity={({ boardSize }) => {
            return game ? (
              <LichessGameContainer boardSize={boardSize} game={game}  homeColor={homeColor} activity={props.activity}/>
            ) : (
              <ChessBoard
                type="free"
                size={boardSize}
                id="empty-frozen-board"
                pgn=""
                homeColor="white"
                onMove={() => {}}
                style={{
                  ...floatingShadow,
                  ...softBorderRadius,
                  overflow: 'hidden',
                }}
              />
            );
          }}
        />
      )}
    />
  );
};
