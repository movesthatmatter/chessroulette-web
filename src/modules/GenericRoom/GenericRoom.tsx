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
import { GameRoomV2 } from '../GameRoomV2/GameRoomV2';
import { RoomWithPlayActivity } from 'src/components/RoomProvider';
// import { GameRoomV2 } from '../GameRoomV2';
// import { isPlayer, getPlayerColor } from '../util';

type Props = {};

export const GenericRoom: React.FC<Props> = () => {
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
        if (p.room.activity.type === 'play') {
          return (
            <GameRoomV2 
              // The type assertion here is needed b/c as of nowTypescript (v4.0)
              //  doesn't support Nested Tagged Unions but these are coming soon (maybe v4.1)!
              //  See: https://github.com/microsoft/TypeScript/pull/38839
              room={p.room as RoomWithPlayActivity}
            />
          )
        }
      }}
      renderRoomNotJoined={({ joinRoom, room, request }) => (
        <>room not joind</>
      )}
      renderFallback={() => <AwesomeLoaderPage />}
      onUpdate={(p) => {
        if (p.state === 'joined') {
          p.startLocalStream();
        }
      }}
      onReady={(p) => {
        // console.log('on ready', p);
        // if (p.state === 'notJoined' && p.roomStats.createdBy === authentication.user.id) {
        //   p.joinRoom();
        // }

        if (p.state === 'notJoined') {
          p.joinRoom();
        }

        

        // console.log('on ready', p);
        // if (p.state === 'joined') {
        //   p.startLocalStream();
        // } else if (
        //   // Join the Room right away if already part of the game!
        //   p.state === 'notJoined'
        //   && isPlayer(authentication.user.id, p.roomStats.game.players)
        // ) {
        //   p.joinRoom();
        // }
        // if (p.request.)
      }}
    />
  );
};
