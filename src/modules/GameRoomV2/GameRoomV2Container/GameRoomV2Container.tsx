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
import { GameRoomV2 } from '../GameRoomV2';
import { isPlayer } from '../util';

type Props = {};

export const GameRoomV2Container: React.FC<Props> = () => {
  const history = useHistory();
  const [faceTimeOn, setFaceTimeOn] = useState(false);
  const authentication = useSelector(selectAuthentication);

  // This should never actually occur!
  if (authentication.authenticationType === 'none') {
    return null;
  }

  return (
    <PeerConsumer
      renderRoomJoined={(p) => {
        const isMePlayer = isPlayer(p.room.me.id, p.room.game.players);

        return (
          <>
            {p.room.game.state === 'waitingForOpponent' && isMePlayer ? (
              <Layer position="center">
                <Box pad="medium" gap="small" width="medium">
                  Waiting for Opponent
                  <ClipboardCopy value={window.location.href} />
                  <Button onClick={() => history.goBack()} label="Cancel" />
                </Box>
              </Layer>
            ) : (
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
              />
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
                There is an active challenge for this room. Do you want to join
                the game?
                <Button
                  onClick={() => {
                    // Join both the room and the game
                    joinRoom();
                    request(gameActions.join());
                  }}
                  primary
                  label="Join Room and Accept the Challenge"
                  disabled={!faceTimeOn}
                />
                <Button
                  onClick={joinRoom}
                  primary
                  label="Join Room and and only Watch"
                  disabled={!faceTimeOn}
                />
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
        }

        if (p.state === 'notJoined') {
          // Join the Room right away if already part of the game!
          if (isPlayer(authentication.user.id, p.roomStats.game.players)) {
            p.joinRoom();
          }
        }
      }}
    />
  );
};
