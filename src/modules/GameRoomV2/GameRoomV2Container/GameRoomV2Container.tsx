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
import { otherChessColor } from 'src/modules/Games/Chess/util'
import { GameRoomV2 } from '../GameRoomV2';
import { isPlayer, getPlayerColor } from '../util';
import { RoomWithPlayActivity } from 'src/components/RoomProvider';

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
      renderRoomJoined={({ room, request }) => {
        if (room.activity.type !== 'play') {
          return null;
        }

        const { game, offer } = room.activity;

        const isMePlayer = isPlayer(room.me.user.id, game.players);
        const myPlayerColor = getPlayerColor(room.me.user.id, game.players);

        return (
          <>
            {isMePlayer && game.state === 'waitingForOpponent' ? (
              <Layer position="center">
                <Box pad="medium" gap="small" width="medium">
                  Waiting for Opponent
                  <ClipboardCopy value={window.location.href} />
                  <Button onClick={() => history.goBack()} label="Cancel" />
                </Box>
              </Layer>
            ) : (
              <>
                {room.activity.type === 'play' && (
                  <GameRoomV2
                    room={room as RoomWithPlayActivity}
                    onMove={(nextMove) => {
                      request(gameActions.move(nextMove));
                    }}
                    onOfferDraw={() => {
                      request(gameActions.offerDraw());
                    }}
                    onResign={() => {
                      request(gameActions.resign());
                    }}
                    onAbort={() => {
                      request(gameActions.abort());
                    }}
                    onRematchOffer={() => {
                      request(gameActions.offerRematch());
                    }}
                  />
                )}
                {isMePlayer
                  && offer?.type === 'draw'
                  && offer?.content.by === otherChessColor(myPlayerColor) && (
                    <Layer position="center">
                      <Box pad="medium" gap="small" width="medium">
                        Your opponent is offering a Draw!
                        <Button
                          onClick={() => request(gameActions.acceptDraw())}
                          label="Accept"
                        />
                        <Button onClick={() => request(gameActions.denyDraw())} label="Deny" />
                      </Box>
                    </Layer>
                )}
                {isMePlayer
                  && offer?.type === 'rematch'
                  && offer?.content.by === otherChessColor(myPlayerColor) && (
                    <Layer position="center">
                      <Box pad="medium" gap="small" width="medium">
                        Your opponent wants a Rematch!
                        <Button
                          onClick={() => request(gameActions.acceptRematch())}
                          label="Accept"
                        />
                        <Button onClick={() => request(gameActions.denyRematch())} label="Deny" />
                      </Box>
                    </Layer>
                )}
              </>
            )}
          </>
        );
      }}
      renderRoomNotJoined={({ joinRoom, room, request }) => {
        if (room.activity.type === 'none') {
          return null;
        }
        
        return (
        <Layer position="center">
          <Box pad="medium" gap="small" width="medium">
            <FaceTimeSetup onUpdated={(s) => setFaceTimeOn(s.on)} />
            {room.activity.game.state === 'waitingForOpponent' ? (
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
                      request(gameActions.join(room.id, ));
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
      )}}
      renderFallback={() => <AwesomeLoaderPage />}
      onReady={(p) => {
        // if (p.state === 'joined') {
        //   p.startLocalStream();
        // } else if (
        //   // Join the Room right away if already part of the game!
        //   p.state === 'notJoined'
        //   && isPlayer(authentication.user.id, p.room.activity.game.players)
        // ) {
        //   p.joinRoom();
        // }
      }}
    />
  );
};
