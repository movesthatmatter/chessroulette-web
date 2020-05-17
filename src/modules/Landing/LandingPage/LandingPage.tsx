import React, { useState } from 'react';
import logo from 'src/assets/logo_black.svg';
import { createUseStyles } from 'src/lib/jss';
import { ColoredButton } from 'src/components/ColoredButton/ColoredButton';
import { PopupModal } from 'src/components/PopupModal/PopupModal';
import { PlayWithFriendsPopup } from 'src/components/PlayWithFriendsPopup/PlayWithFriendsPopup';
import { SocketConsumer } from 'src/components/SocketProvider';
import { PeerRecord, CreateRoomResponse } from 'dstnd-io';
import { useHistory } from 'react-router-dom';
import { createRoom, createChallenge, getPrivateRoom } from 'src/resources';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import chessBackground from './assets/chess_icons.png';

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
          <div className={cls.leftSideContainer}>
            <img src={logo} alt="logo" className={cls.logo} />
            <div>
              <p className={cls.headerText}>
                Play chess online with
                <br />
                video streaming
              </p>
            </div>
            <div
              style={{ marginTop: '5px', marginBottom: '10px' }}
              className={cls.text}
            >
              No account needed.
              <br />
              Game hosting and video chat.
              <br />
              Play with friends in a private lobby
              <br />
              or join an open challenge.
              <br />
            </div>
            <div className={cls.buttonsContainer}>
              <div style={{ marginRight: '30px' }}>
                <ColoredButton
                  label="Play with Friends"
                  color="#08D183"
                  fontSize="21px"
                  padding="5px"
                  onClickFunction={() => setFriendsPopup(true)}
                />
              </div>
              <div className={cls.buttonWithMutunachiWrapper}>
                <Mutunachi
                  mid={12}
                  className={cls.mutunachi}
                />
                <ColoredButton
                  label="Play Open Challenge"
                  color="#54C4F2"
                  fontSize="21px"
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
          <div className={cls.chessboard} />
        </div>
      )}
    />
  );
};

const useStyles = createUseStyles({
  container: {
    fontFamily: 'Open Sans, sans-serif',
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: '0',
    left: '0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chessboard: {
    width: '360px',
    height: '321px',
    background: ` url(${chessBackground})`,
  },
  headerText: {
    fontFamily: 'Roboto Slab',
    fontWeight: 'bold',
    fontSize: '48px',
    lineHeight: '63px',
    margin: '0 auto',
    color: '#262626',
    position: 'relative',
    zIndex: 2,
  },
  buttonsContainer: {
    marginTop: '80px',
    marginLeft: '100px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'spaced-around',
  },
  logo: {
    marginBottom: '20px',
  },
  text: {
    fontFamily: 'Roboto Slab',
    fontSize: '18px',
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
  leftSideContainer: {
    display: 'flex',
    width: '575px',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  buttonWithMutunachiWrapper: {
    position: 'relative',
  },
  mutunachi: {
    position: 'absolute',
    zIndex: 1,
    top: `-${171 + 50}px`,
    left: '12%',
    height: '220px',
  },
});
