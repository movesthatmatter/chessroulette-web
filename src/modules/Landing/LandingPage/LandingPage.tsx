import React, { useState } from 'react';
import logo from 'src/assets/logo_black.svg';
import { createUseStyles } from 'src/lib/jss';
import { ColoredButton } from 'src/components/ColoredButton/ColoredButton';
import { PopupModal } from 'src/components/PopupModal/PopupModal';
import { PlayWithFriendsPopup } from 'src/components/PlayWithFriendsPopup/PlayWithFriendsPopup';
import { SocketConsumer } from 'src/components/SocketProvider';
import { PeerRecord, CreateRoomResponse } from 'dstnd-io';
import { useHistory } from 'react-router-dom';
import {
  createRoom, createChallenge, getPrivateRoom,
} from 'src/resources';
import { SplashScreenBoardWithButtons } from './components/SplashScreenBoardWithButtons';

type Props = {};

const toRoomPath = (room: CreateRoomResponse) =>
  `${room.id}${room.type === 'private' ? `/${room.code}` : ''}`;

export const LandingPage: React.FC<Props> = () => {
  const cls = useStyles();
  const history = useHistory();
  const [friendsPopup, setFriendsPopup] = useState(false);
  const [me, setMe] = useState<PeerRecord | void>();

  return (
    <SocketConsumer
      onMessage={(msg) => {
        if (msg.kind === 'connectionOpened') {
          setMe(msg.content.me);
        }
      }}
      render={() => (
        <div className={cls.container}>
          <PopupModal show={friendsPopup}>
            <>
              {me && (
                <PlayWithFriendsPopup
                  close={() => setFriendsPopup(false)}
                  dispatchCodeJoin={async (code) => {
                    (await getPrivateRoom(code))
                      .mapErr(() => {
                        console.log('Bad Code - Let the user know');
                      })
                      .map((room) => {
                        history.push(`/gameroom/${toRoomPath(room)}`);
                      });
                  }}
                  dispatchCreate={async () => {
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
              )}
            </>
          </PopupModal>
          <>
            <div className={cls.leftMargin} />
            <div className={cls.leftSideContainer}>
              <img src={logo} alt="logo" className={cls.logo} />
              <div>
                <p className={cls.headerText}>
                  P2P Chess Games with Video Chat
                </p>
              </div>
              <div
                style={{ marginTop: '5px', marginBottom: '10px' }}
                className={cls.text}
              >
                No account needed. Free P2P Chess Game hosting and video
                chat. Just share the generated code with a friend and start
                playing.
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
                      if (!me) {
                        return;
                      }

                      (await createChallenge({ peerId: me.id })).map(
                        (room) => {
                          history.push(`/gameroom/${toRoomPath(room)}`);
                        },
                      );
                    }}
                  />
                </div>
              </div>
            </div>
            <SplashScreenBoardWithButtons />
            <div className={cls.rightMargin} />
          </>
        </div>
      )}
    />
  );
};

const useStyles = createUseStyles({
  container: {
    fontFamily: 'Open Sans, sans-serif',
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
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
