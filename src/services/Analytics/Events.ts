import capitalize from 'capitalize';
import { RoomChallengeRecord, RoomRecord } from 'chessroulette-io';
import ReactGA from 'react-ga';
import { Room } from 'src/modules/Room';
import { RoomActivity } from 'src/modules/Room/RoomActivity/types';

const trackEvent = ({
  category,
  action,
  description,
  ...rest
}: {
  category: EventCategory;
  action: string;
  value?: number;
  description?: string;
  nonInteraction?: boolean;
  // dimensions?: Record<string, string | number>;
}) => {
  ReactGA.event({
    category,
    action,

    ...(description && {
      label: description,
    }),

    ...rest,
  });

};

type ChallengeType = 'Friendly Challenge' | 'Quick Pairing';
type GameEndedReason =
  | 'Check Mate'
  | 'Draw Accepted'
  | 'Resignation'
  | 'Abortion'
  | 'Time Finished'
  | 'Stalemate'
  | 'Threefold Repetition';

enum EventCategory {
  User = 'User',
  GameChess = 'Game - Chess',
  PlayerChess = 'Player - Chess',
  Chat = 'Chat',
  Room = 'Room',
  App = 'App',
}

export const Events = {
  trackEvent,

  trackPageView: (pageName: string) => {
    const { location } = window;
    const path = location.pathname;
    // const search = location.search;

    const page = pageName;
    ReactGA.set({
      page,
      location: `${location.origin}${path}`,
    });

    ReactGA.pageview(page);
  },

  trackChallengeCreated: (type: ChallengeType) =>
    trackEvent({
      category: EventCategory.User,
      action: 'Challenge Created',
      description: type,
    }),

  trackFriendlyChallengeAccepted: () =>
    trackEvent({
      category: EventCategory.User,
      action: 'Friendly Challenge Accepted',
    }),

  trackQuickPairingMatched: () =>
    trackEvent({
      category: EventCategory.User,
      action: 'Quick Pairing Matched',
    }),

  trackAVPermissionsRequestAccepted: (type: 'public' | 'private') =>
    trackEvent({
      category: EventCategory.Room,
      action: 'AV Permissions Request Accepted',
      description: capitalize(type),
    }),

  trackRoomCreated: (room: RoomRecord) =>
    trackEvent({
      category: EventCategory.Room,
      action: `Room Created: ${capitalize(room.type)}`,
      description: `Room Type: ${capitalize(room.type)} | Activity: ${capitalize(
        room.activity.type
      )}`,
    }),

  trackRoomJoiningConfirmed: (type: 'public' | 'private') =>
    trackEvent({
      category: EventCategory.Room,
      action: 'Room Joining Confirmed',
      description: capitalize(type),
    }),

  trackRoomJoiningCanceled: (type: 'public' | 'private') =>
    trackEvent({
      category: EventCategory.Room,
      action: 'Room Joining Canceled',
      description: capitalize(type),
    }),

  trackRoomJoined: (room: Room) =>
    trackEvent({
      category: EventCategory.Room,
      action: 'Room Joined',
      description: `Room Type: ${capitalize(room.type)} | Activity: ${capitalize(
        room.activity.type
      )}`,
    }),

  trackSwitchedRoomActivity: (type: RoomRecord['activity']['type']) =>
    trackEvent({
      category: EventCategory.Room,
      action: 'Room Activity Switched',
      description: capitalize(type),
    }),

  trackRoomChallengeCreated: (roomChallenge: RoomChallengeRecord) =>
    trackEvent({
      category: EventCategory.Room,
      action: 'Room Challenge Created',
      description: `TimeLimit: ${capitalize(roomChallenge.gameSpecs.timeLimit)}`,
    }),

  trackRoomChallengeAccepted: (roomChallenge: RoomChallengeRecord) =>
    trackEvent({
      category: EventCategory.Room,
      action: 'Room Challenge Accepted',
      description: `TimeLimit: ${capitalize(roomChallenge.gameSpecs.timeLimit)}`,
    }),

  trackRoomChallengeCanceled: (roomChallenge: RoomChallengeRecord) =>
    trackEvent({
      category: EventCategory.Room,
      action: 'Room Challenge Canceled',
      description: `TimeLimit: ${capitalize(roomChallenge.gameSpecs.timeLimit)}`,
    }),

  trackDrawOffered: () =>
    trackEvent({
      category: EventCategory.PlayerChess,
      action: 'Draw Offered',
    }),

  trackDrawAccepted: () =>
    trackEvent({
      category: EventCategory.PlayerChess,
      action: 'Draw Accepted',
    }),

  trackDrawDenied: () =>
    trackEvent({
      category: EventCategory.PlayerChess,
      action: 'Draw Denied',
    }),

  trackResigned: () =>
    trackEvent({
      category: EventCategory.PlayerChess,
      action: 'Resigned',
    }),

  trackAborted: () =>
    trackEvent({
      category: EventCategory.PlayerChess,
      action: 'Aborted',
    }),

  trackRematchOffered: () =>
    trackEvent({
      category: EventCategory.PlayerChess,
      action: 'Rematch Offered',
    }),

  trackRematchDenied: () =>
    trackEvent({
      category: EventCategory.PlayerChess,
      action: 'Rematch Denied',
    }),

  trackRematchAccepted: () =>
    trackEvent({
      category: EventCategory.PlayerChess,
      action: 'Rematch Accepted',
    }),

  trackGameStarted: (color: 'white' | 'black') =>
    trackEvent({
      category: EventCategory.GameChess,
      action: 'Game Started',
      description: capitalize(color),
    }),

  trackGameEnded: (reason: 'finished' | 'stopped') =>
    trackEvent({
      category: EventCategory.GameChess,
      action: 'Game Ended',
      description: capitalize(reason),
    }),

  trackChatMessageSent: () =>
    trackEvent({
      category: EventCategory.Chat,
      action: 'Message Sent',
    }),
  // trackMoveMade: (color: 'white' | 'black') => trackEvent({
  //   category: 'Game - Chess',
  //   action: 'Move Made',
  //   description: capitalize(color),
  // }),

  // Feedback

  trackFeedbackDialogSeen: (step: 'Rating Step' | 'Review Step' | 'Friends Invite Step') =>
    trackEvent({
      category: EventCategory.App,
      action: `Feedback Dialog: Seen ${step}`,
      description: capitalize(step),
      nonInteraction: true,
    }),
  trackFeedbackDialogPostponed: (step: 'Rating Step') =>
    trackEvent({
      category: EventCategory.App,
      action: `Feedback Dialog: Postponed ${step}`,
    }),

  trackFeedbackDialogRated: (answer: 'negative' | 'neutral' | 'positive') =>
    trackEvent({
      category: EventCategory.App,
      action: 'Feedback Dialog: Rated',
      description: answer,
    }),
  trackFeedbackDialogReviewButtonPressed: (answer: 'negative' | 'neutral' | 'positive') =>
    trackEvent({
      category: EventCategory.App,
      action: 'Feedback Dialog: Review Button Pressed',
      description: answer,
    }),
  trackFeedbackDialogInviteFriendsShareButtonPressed: () =>
    trackEvent({
      category: EventCategory.App,
      action: 'Feedback Dialog: Invite Friends Share Button Pressed',
    }),

  // Others

  trackBrowserNotSupportedDialogShown: () =>
    trackEvent({
      category: EventCategory.App,
      action: 'Browser Not Supported Dialog Show',
      nonInteraction: true,
    }),

  // Authentication
  trackAuthenticated: (
    type: 'login' | 'registration',
    via: 'email' | 'facebook' | 'lichess' | 'twitch'
  ) =>
    trackEvent({
      category: EventCategory.App,
      action: capitalize(type),
      description: `Via ${capitalize(via)}`,
    }),
  trackDeauthenticated: () =>
    trackEvent({
      category: EventCategory.App,
      action: 'Logout',
    }),
};
