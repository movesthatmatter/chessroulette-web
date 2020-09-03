import React from 'react';
import { PeerConsumer } from 'src/components/PeerProvider';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { Layer, Box } from 'grommet';
import { Button } from 'src/components/Button';
import { useHistory } from 'react-router-dom';
import { ClipboardCopy } from 'src/components/CipboardCopy';
import { SocketConsumer } from 'src/components/SocketProvider';
import { GameRoomV2 } from '../GameRoomV2';
import { isPlayer } from '../util';

type Props = {};

export const GameRoomV2Container: React.FC<Props> = () => {
  const history = useHistory();

  return (
    <SocketConsumer
      render={({ socket }) => (
        <PeerConsumer
          render={(p) => {
            const isMePlayer = isPlayer(p.room.me.id, p.room.game.players);

            return (
              <>
                {p.room.game.state === 'waitingForOpponent' && (
                  <>
                    {isMePlayer ? (
                      <Layer position="center">
                        <Box pad="medium" gap="small" width="medium">
                          Waiting for Opponent
                          <ClipboardCopy value={window.location.href} />
                          <Button
                            onClick={() => history.goBack()}
                            label="Cancel"
                          />
                        </Box>
                      </Layer>
                    ) : (
                      <Layer position="center">
                        <Box pad="medium" gap="small" width="medium">
                          {/* <FaceTimeSetup /> */}
                          Do you want to join the game?
                          <Button
                            onClick={() => {
                              socket.send({
                                kind: 'gameJoinRequest',
                                content: undefined,
                              });
                            }}
                            primary
                            label="Join"
                          />
                          <Button
                            onClick={() => history.goBack()}
                            label="Cancel"
                          />
                        </Box>
                      </Layer>
                    )}
                  </>
                )}
                <GameRoomV2
                  room={p.room}
                  onMove={(nextMove) => {
                    socket.send({
                      kind: 'gameMoveRequest',
                      content: nextMove,
                    });
                  }}
                  onOfferDraw={() => {
                    socket.send({
                      kind: 'gameDrawOfferingRequest',
                      content: undefined,
                    });
                  }}
                  onResign={(resigningColor) => {
                    socket.send({
                      kind: 'gameResignationRequest',
                      content: { resigningColor },
                    });
                  }}
                />
              </>
            );
          }}
          renderFallback={() => <AwesomeLoaderPage />}
          onReady={(p) => {
            // Show my stream right away for now but later it could be
            // on demand from inside the room
            p.showMyStream();
          }}
        />
      )}
    />
  );
};
