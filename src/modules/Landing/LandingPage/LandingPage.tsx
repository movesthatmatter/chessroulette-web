import React, { useState, useEffect } from 'react';
import logo from 'src/assets/logo_black.svg';
import { createUseStyles } from 'src/lib/jss';
import { ColoredButton } from 'src/components/ColoredButton/ColoredButton';
import { PopupModal } from 'src/components/PopupModal/PopupModal';
import { PlayWithFriendsPopup } from 'src/components/PlayWithFriendsPopup/PlayWithFriendsPopup';
import { SocketConsumer } from 'src/components/SocketProvider';
import {
  PublicRoomsResponsePayload,
  PeerRecord,
  RoomStatsRecord,
} from 'dstnd-io';
import { Result } from 'ts-results';
import { GameRoomContainer } from 'src/modules/GameRoom/GameRoomContainer';
import { SplashScreenBoardWithButtons } from './components/SplashScreenBoardWithButtons';
import { createRoom, createChallenge } from './resources';

type Props = {
  getRooms: () => Promise<Result<PublicRoomsResponsePayload, unknown>>;
};

export const LandingPage: React.FC<Props> = ({ getRooms }: Props) => {
  const cls = useStyles();
  const [publicRooms, setPublicRooms] = useState<PublicRoomsResponsePayload>([]);
  const [friendsPopup, setFriendsPopup] = useState(false);
  const [me, setMe] = useState<PeerRecord | void>();
  const [joinedRoom, setJoinedRoom] = useState<RoomStatsRecord | void>();

  useEffect(() => {
    (async () => {
      const res = await getRooms();

      res.map(setPublicRooms);
    })();
  }, []);
  return (
    <SocketConsumer
      onMessage={(msg) => {
        if (msg.kind === 'joinRoomSuccess') {
          setMe(msg.content.me);
          setJoinedRoom(msg.content.room);
        } else if (msg.kind === 'roomStats') {
          setJoinedRoom(msg.content);
        } else if (msg.kind === 'connectionOpened') {
          setMe(msg.content.me);
        }
      }}
      render={({ send }) => (
        <>
          {joinedRoom && me ? (
            <GameRoomContainer
              room={joinedRoom}
              me={me}
            />
          ) : (me && (
            <div className={cls.container}>
              <PopupModal show={friendsPopup}>
                <PlayWithFriendsPopup
                  close={() => setFriendsPopup(false)}
                  dispatchCodeJoin={(value) => {
                    publicRooms.forEach((room) => {
                      send({
                        kind: 'joinRoomRequest',
                        content: {
                          roomId: room.id,
                          code: value,
                        },
                      });
                    });
                  }}
                  dispatchCreate={async () => {
                    (await createRoom({
                      nickname: undefined,
                      peerId: me.id,
                      type: 'private',
                    }))
                      .map((r) => {
                        send({
                          kind: 'joinRoomRequest',
                          content: {
                            roomId: r.id,
                            code: r.type === 'private' ? r.code : undefined,
                          },
                        });
                      });
                  }}
                />
              </PopupModal>
              <div className={cls.leftMargin} />
              <div className={cls.leftSideContainer}>
                <img src={logo} alt="logo" className={cls.logo} />
                <div>
                  <p className={cls.headerText}>P2P Chess Games with Video Chat</p>
                </div>
                <div
                  style={{ marginTop: '5px', marginBottom: '10px' }}
                  className={cls.text}
                >
                  No account needed. Free P2P Chess Game hosting and video chat. Just
                  share the generated code with a friend and start playing.
                </div>
                <div className={cls.buttonsContainer}>
                  <div style={{ marginRight: '30px' }}>
                    <ColoredButton
                      label="Play with Friends"
                      color="#08D183"
                      fontSize="21px"
                      onClickFunction={() => setFriendsPopup(true)}
                    />
                  </div>
                  <div>
                    <ColoredButton
                      label="Play Open Challenge"
                      color="#54C4F2"
                      fontSize="21px"
                      onClickFunction={async () => {
                        (await createChallenge({ peerId: me.id }))
                          .map((r) => {
                            send({
                              kind: 'joinRoomRequest',
                              content: {
                                roomId: r.id,
                                code: r.type === 'private' ? r.code : undefined,
                              },
                            });
                          });
                      }}
                    />
                  </div>
                </div>
              </div>
              <SplashScreenBoardWithButtons />
              <div className={cls.rightMargin} />
            </div>
          ))}
        </>
      )}
    />
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  background: {
    color: '#262626',
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
  },
  headerText: {
    fontFamily: 'Roboto Slab',
    fontWeight: 'bold',
    fontSize: '48px',
    lineHeight: '63px',
    margin: '0 auto',
    color: '#262626',
  },
  buttonsContainer: {
    marginTop: '20px',
    marginLeft: '40px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'spaced-around',
  },
  logo: {
    marginBottom: '40px',
  },
  text: {
    fontFamily: 'Open Sans',
  },
  link: {
    margin: '0px',
    maxWidth: '100px',
    borderRadius: '15px',
    backgroundColor: '#e9685a',
    textAlign: 'center',
    color: 'white',
    textDecoration: 'none',

    '&:hover': {
      transform: 'scale(1.05)',
      textDecoration: 'none',
      cursor: 'pointer',
      backgroundColor: '#e9685a',
    },
  },
  linkContent: {
    padding: '10px',
  },
  leftMargin: {
    width: '100%',
  },
  rightMargin: {
    width: '100%',
  },
  leftSideContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    minWidth: '500px',
    marginRight: '70px',
  },
});
