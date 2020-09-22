import React, { useState } from 'react';
import { PeerConsumer } from 'src/components/PeerProvider';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { Layer, Box } from 'grommet';
import { Button } from 'src/components/Button';
import { useHistory } from 'react-router-dom';
import { ClipboardCopy } from 'src/components/CipboardCopy';
import { FaceTimeSetup } from 'src/components/FaceTimeArea/FaceTimeSetup';
import { selectAuthentication } from 'src/services/Authentication';
import { useSelector } from 'react-redux';
import { gameActions } from 'src/modules/Games/Chess/gameActions';
import { otherChessColor } from 'src/modules/Games/Chess/util';
import { GameRoomV2 } from '../GameRoomV2';
import { isPlayer, getPlayerColor } from '../util';

type Props = {};

export const GameRoomV2Container: React.FC<Props> = () => {
  const history = useHistory();
  const [faceTimeOn, setFaceTimeOn] = useState(false);
  const authentication = useSelector(selectAuthentication);

  // const [hasJoinedRoom, setHasJoinedRoom] = useSe

  // This should never actually occur!
  if (authentication.authenticationType === 'none') {
    return null;
  }

  return (
    <PeerConsumer
      renderRoomJoined={(p) => {
        const isMePlayer = isPlayer(p.room.me.user.id, p.room.game.players);
        const myPlayerColor = getPlayerColor(p.room.me.user.id, p.room.game.players);

        return (
          <>
            {isMePlayer && p.room.game.state === 'waitingForOpponent' ? (
              <Layer position="center">
                <Box pad="medium" gap="small" width="medium">
                  Waiting for Opponent
                  <ClipboardCopy value={window.location.href} />
                  <Button onClick={() => history.goBack()} label="Cancel" />
                </Box>
              </Layer>
            ) : (
              <>
                <GameRoomV2
                  room={p.room}
                  onMove={(nextMove) => {
                    p.request(gameActions.move(nextMove));
                  }}
                  onOfferDraw={() => {
                    p.request(gameActions.offerDraw());
                  }}
                  onResign={() => {
                    p.request(gameActions.resign());
                  }}
                  onAbort={() => {
                    p.request(gameActions.abort());
                  }}
                  onRematchOffer={() => {
                    p.request(gameActions.offerRematch());
                  }}
                />
                {isMePlayer
                  && p.room.gameOffer?.type === 'draw'
                  && p.room.gameOffer.content.by === otherChessColor(myPlayerColor) && (
                    <Layer position="center">
                      <Box pad="medium" gap="small" width="medium">
                        Your opponent is offering a Draw!
                        <Button
                          onClick={() => p.request(gameActions.acceptDraw())}
                          label="Accept"
                        />
                        <Button onClick={() => p.request(gameActions.denyDraw())} label="Deny" />
                      </Box>
                    </Layer>
                )}
                {isMePlayer
                  && p.room.gameOffer?.type === 'rematch'
                  && p.room.gameOffer.content.by === otherChessColor(myPlayerColor) && (
                    <Layer position="center">
                      <Box pad="medium" gap="small" width="medium">
                        Your opponent wants a Rematch!
                        <Button
                          onClick={() => p.request(gameActions.acceptRematch())}
                          label="Accept"
                        />
                        <Button onClick={() => p.request(gameActions.denyRematch())} label="Deny" />
                      </Box>
                    </Layer>
                )}
              </>
            )}
          </>
        );
      }}
      renderRoomNotJoined={({ joinRoom, roomStats, request }) => (
        <Layer position="center">
          <Box pad="medium" gap="small" width="medium">
            <FaceTimeSetup onUpdated={(s) => setFaceTimeOn(s.on)} />
            {roomStats.game.state === 'waitingForOpponent' ? (
              <>
                {/* There is an active challenge for this room. Do you want to join
                the game? */}
                <Box direction="row" gap="small">
                  <Button
                    primary
                    label="Join Game"
                    disabled={!faceTimeOn}
                    onClick={() => {
                      // Join both the room and the game
                      // joinRoom();
                      request(gameActions.join(roomStats.id, ));
                    }}
                    fill="horizontal"
                  />
                  <Button
                    primary
                    label="Just Watch"
                    disabled={!faceTimeOn}
                    onClick={joinRoom}
                    fill="horizontal"
                  />
                </Box>
              </>
            ) : (
              <>
                There is a game currently going on. Do you want to watch?
                <Button
                  onClick={joinRoom}
                  primary
                  label="Watch Ongoing Game"
                  disabled={!faceTimeOn}
                />
              </>
            )}

            <Button onClick={() => history.goBack()} label="Cancel" />
          </Box>
        </Layer>
      )}
      renderFallback={() => <AwesomeLoaderPage />}
      onReady={(p) => {
        if (p.state === 'joined') {
          p.startLocalStream();
        } else if (
          // Join the Room right away if already part of the game!
          p.state === 'notJoined'
          && isPlayer(authentication.user.id, p.roomStats.game.players)
        ) {
          p.joinRoom();
        }
      }}
    />
  );
};
