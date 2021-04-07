import { Layer } from 'grommet';
import { AppsRounded, Chat } from 'grommet-icons';
import React, { useRef, useState, useEffect } from 'react';
import { NavigationHeader } from 'src/components/Navigation';
import { StreamingBox } from 'src/components/StreamingBox';
import { Text } from 'src/components/Text';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { MobileGameRoomLayout } from 'src/modules/GameRoomV2/GameRoomLayout/MobileGameRoomLayout';
import {
  colors,
  floatingShadow,
  fonts,
  hardBorderRadius,
  onlyMobile,
  onlySmallMobile,
  SMALL_MOBILE_BREAKPOINT,
  softBorderRadius,
} from 'src/theme';
import { LayoutProps } from '../types';
import cx from 'classnames';
import { PlayerBox } from 'src/modules/Games/Chess/components/PlayerBox';
import { otherChessColor } from 'src/modules/Games/Chess/util';
import { getRelativeMaterialScore } from 'src/modules/Games/Chess/components/GameStateWidget/util';
import { ChessGameV2 } from 'src/modules/Games/Chess/components/ChessGameV2';
import { useWindowWidth } from '@react-hook/window-size';
import { GameActions } from '../components/GameActions';
import { ChatContainer } from 'src/modules/Chat';
import { ChatIconWithBadge } from 'src/modules/Chat/components/ChatIconWithBadge';
import { useSelector } from 'react-redux';
import { selectChatHistory, selectUserID } from 'src/providers/PeerProvider/redux/selectors';

type Props = LayoutProps;

export const MobileLayout: React.FC<Props> = (props) => {
  const cls = useStyles();

  const { game } = props;

  const mobileGameActionsRef = useRef<HTMLDivElement>(null);

  const mobileChatButton = useRef<HTMLDivElement>(null);

  const chatHistory = useSelector(selectChatHistory);
  const me = useSelector(selectUserID);
  const newMessageCounter = useRef(0);
  const [showMobileGameActionsMenu, setShowMobileGameActionsMenu] = useState(false);

  const [showChatWindow, setShowChatWindow] = useState(false);
  // This should be container width
  const windowWidth = useWindowWidth();

  useEffect(() => {
    if (chatHistory && !showChatWindow) {
      if (chatHistory.messages.length > 0 && chatHistory.messages[0].fromUserId !== me) {
        newMessageCounter.current += 1;
      }
    }
  }, [chatHistory?.messages]);

  useEffect(() => {
    newMessageCounter.current = 0;
  }, []);

  function markMessagesAsRead() {
    newMessageCounter.current = 0;
  }

  // TODO: These shouldn't be here!
  // TOODO: In fact the whole notion of timeleft is conceptualy wrong here.
  //   What I need to know at this level is timeSinceLastMove - which then gets passed to the countdown
  // or, if not then save the timeleft here or somewhere nad just feed it to a clock!
  //  Maybe it does make sense to use a hook then hmmm, which could then just give all the stats I need!
  const now = new Date();
  const myTimeLeft =
    game.state === 'started' && game.lastMoveBy !== props.homeColor
      ? game.timeLeft[props.homeColor] - (now.getTime() - new Date(game.lastMoveAt).getTime())
      : game.timeLeft[props.homeColor];
  const opponentTimeLeft =
    game.state === 'started' && game.lastMoveBy === props.homeColor
      ? game.timeLeft[otherChessColor(props.homeColor)] -
        (now.getTime() - new Date(game.lastMoveAt).getTime())
      : game.timeLeft[otherChessColor(props.homeColor)];
  const materialScore = getRelativeMaterialScore(game.captured);

  return (
    <MobileGameRoomLayout
      getTopArea={(dimensions) => (
        <StreamingBox
          room={props.room}
          focusedPeerId={!!props.meAsPlayer ? props.opponentAsPlayer?.user.id : undefined}
          aspectRatio={dimensions}
          headerOverlay={() => <NavigationHeader />}
          mainOverlay={() => (
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
              }}
            >
              <div
                className={cls.mobileGameActionsContainer}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                }}
              >
                <div ref={mobileChatButton} style={{ backgroundColor: 'transparent' }}>
                  <ChatIconWithBadge
                    color={colors.white}
                    onClick={() => {
                      markMessagesAsRead();
                      setShowChatWindow(true);
                    }}
                    newMessages={newMessageCounter.current}
                  />
                </div>
                <div ref={mobileGameActionsRef}>
                  <AppsRounded
                    color={colors.white}
                    onClick={() => setShowMobileGameActionsMenu(true)}
                    className={cls.mobileGameActionsButtonIcon}
                  />
                </div>
                {showMobileGameActionsMenu && mobileGameActionsRef.current && (
                  <Layer
                    responsive={false}
                    position="bottom"
                    animation="slide"
                    className={cls.mobileGameActionMenuLayer}
                    onClickOutside={() => setShowMobileGameActionsMenu(false)}
                  >
                    <Text size="small2" className={cls.mobileDialogTitle}>
                      What's your next move?
                    </Text>
                    <GameActions
                      isMobile={true}
                      game={game}
                      onAbort={() => {
                        props.onAbort();
                        setShowMobileGameActionsMenu(false);
                      }}
                      onOfferDraw={() => {
                        props.onOfferDraw();
                        setShowMobileGameActionsMenu(false);
                      }}
                      onRematchOffer={() => {
                        props.onRematchOffer();
                        setShowMobileGameActionsMenu(false);
                      }}
                      onResign={() => {
                        props.onResign();
                        setShowMobileGameActionsMenu(false);
                      }}
                      className={cls.mobileGameActionButtonsContainer}
                    />
                  </Layer>
                )}
                {showChatWindow && mobileChatButton.current && (
                  <Layer
                    // style={{ borderRadius: '18px', left: '10px', bottom: '10px' }}
                    modal={false}
                    responsive={false}
                    position="bottom-left"
                    animation="slide"
                    className={cls.chatContainer}
                    onClickOutside={() => setShowChatWindow(false)}
                  >
                    {/* <div className={cls.chatContainer}> */}
                      <ChatContainer />
                    {/* </div> */}
                  </Layer>
                )}
              </div>
            </div>
          )}
          // Account for the rounded border
          footerOverlay={() => <div style={{ height: '16px' }} />}
        />
      )}
      getMainArea={(dimensions) => (
        <div className={cls.mobileMainContainer}>
          {props.opponentAsPlayer && (
            <div className={cx(cls.mobilePlayerWrapper, cls.mobileAwayPlayerWrapper)}>
              <PlayerBox
                player={props.opponentAsPlayer}
                timeLeft={opponentTimeLeft}
                active={
                  game.state === 'started' && game.lastMoveBy !== props.opponentAsPlayer.color
                }
                gameTimeLimit={game.timeLimit}
                material={materialScore[props.opponentAsPlayer.color]}
                onTimerFinished={props.onTimerFinished}
              />
            </div>
          )}
          <div className={cls.mobileChessGameWrapper}>
            <ChessGameV2
              game={game}
              onMove={({ move, pgn }) => {
                props.onMove(move, pgn, [], props.homeColor);
              }}
              playable={props.canIPlay}
              homeColor={props.homeColor}
              size={dimensions.width - (windowWidth < SMALL_MOBILE_BREAKPOINT ? 60 : 24)}
              className={cls.mobileBoard}
            />
          </div>
          {props.meAsPlayer && (
            <div className={cx(cls.mobilePlayerWrapper, cls.mobileHomePlayerWrapper)}>
              <PlayerBox
                player={props.meAsPlayer}
                timeLeft={myTimeLeft}
                active={game.state === 'started' && game.lastMoveBy !== props.meAsPlayer.color}
                gameTimeLimit={game.timeLimit}
                material={materialScore[props.meAsPlayer.color]}
                onTimerFinished={props.onTimerFinished}
              />
            </div>
          )}
        </div>
      )}
    />
  );
};

const useStyles = createUseStyles({
  container: {},
  // Mobile
  mobileGameActionsButtonIcon: {
    ...floatingShadow,
  },
  mobileGameActionsContainer: {
    padding: '0 12px 4px',

    ...onlySmallMobile({
      padding: '0 8px 4px',
    }),
  },
  mobileGameActionMenuLayer: {
    ...softBorderRadius,
    ...floatingShadow,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    width: '100%',

    justifyContent: 'center',
    alignItems: 'center',

    padding: '16px 0 8px',
  },
  mobileGameActionButtonsContainer: {
    width: '70%',
    padding: '16px',
  },
  mobileDialogTitle: {
    ...fonts.subtitle1,
  },
  mobileMainContainer: {
    paddingBottom: '8px',
  },
  chatContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    height: '54%',
    padding: '10px',
    ...makeImportant({
      ...hardBorderRadius,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      overflow: 'hidden',
      // backgroundColor: 'rgba(255, 255, 255, .9)',
      // opacity: .95,
    }),
    // height: '400px',
  },
  mobileBoard: {
    ...floatingShadow,
    ...softBorderRadius,
    overflow: 'hidden',
  },
  mobileChessGameWrapper: {
    padding: '6px 12px 8px',

    ...onlySmallMobile({
      paddingLeft: '30px',
      paddingRight: '30px',
    }),
  },
  mobilePlayerWrapper: {
    padding: '0 12px',

    ...onlySmallMobile({
      padding: '0 8px',
    }),
  },
  mobileAwayPlayerWrapper: {},
  mobileHomePlayerWrapper: {},
});
