import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { ColoredButton } from 'src/components/ColoredButton/ColoredButton';
import { createRoom, createChallenge, getPrivateRoom } from 'src/resources';
import { useHistory } from 'react-router-dom';
import { SocketConsumer } from 'src/components/SocketProvider';
import { PeerRecord, CreateRoomResponse } from 'dstnd-io';
import { Mutunachi } from '../Mutunachi/Mutunachi';

type Props = {
};
const toRoomPath = (room: CreateRoomResponse) =>
  `${room.id}${room.type === 'private' ? `/${room.code}` : ''}`;
export const RoomNotAvailablePopup: React.FC<Props> = () => {
  const cls = useStyle();
  const [me, setMe] = useState<PeerRecord | void>();
  const history = useHistory();
  return (
    <SocketConsumer
      onMessage={(msg) => {
        if (msg.kind === 'connectionOpened') {
          setMe(msg.content.me);
        }
      }}
      render={() => (
        <div className={cls.container}>
          <div className={cls.title}>
            This room is not available anymore.
            <br />
            <Mutunachi
              mid={2}
              style={{ height: '60px' }}
            />
            <br />
            <span style={{ color: '#08D183' }}>Create</span>
            {' '}
            a new room and invite your
            friends
            {' '}
            <br />
            or
            <br />
            {' '}
            <span style={{ color: '#54C4F2' }}>Join</span>
            {' '}
            an open challenge.
          </div>
          <div className={cls.bottomPart}>
            <div style={{ marginBottom: '30px' }}>
              {me
                ? (
                  <ColoredButton
                    label="Create New Room"
                    color="#08D183"
                    fontSize="21px"
                    padding="5px"
                    onClickFunction={async () => {
                      (
                        await createRoom({
                          nickname: undefined,
                          peerId: me.id,
                          type: 'private',
                        })
                      ).map((room) => {
                        history.push(`/gameroom/${toRoomPath(room)}`);
                      });
                    }}
                  />
                )
                : <div>No connection detected!</div>}
            </div>
            <div>
              <ColoredButton
                label="Join Open Challenge"
                color="#54C4F2"
                fontSize="19px"
                padding="5px"
                onClickFunction={async () => {
                  if (!me) {
                    return;
                  }

                  (await createChallenge({ peerId: me.id })).map((room) => {
                    history.push(`/gameroom/${toRoomPath(room)}`);
                  });
                }}
              />
            </div>
          </div>
        </div>
      )}
    />
  );
};

const useStyle = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontFamily: 'Open Sans',
    fontSize: '18px',
  },
  title: {
    textAlign: 'center',
  },
  bottomPart: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',

  },
});
