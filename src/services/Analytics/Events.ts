import capitalize from 'capitalize';
import ReactGA from 'react-ga';

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
  Misc = 'Misc',
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

  // Marketing

  trackRateAndReviewDialogShown: () =>
    trackEvent({
      category: EventCategory.Misc,
      action: 'Rate And Review Dialog Shown',
      nonInteraction: true,
    }),
  trackRateAndReviewDialogAnswered: (answer: 'negative' | 'neutral' | 'positive') =>
    trackEvent({
      category: EventCategory.Misc,
      action: 'Rate And Review Dialog Answered',
      description: answer,
    }),
  trackRateAndReviewDialogPostponed: () =>
    trackEvent({
      category: EventCategory.Misc,
      action: 'Rate And Review Dialog Postponed',
    }),
  trackRateAndReviewDialogLeaveReviewButtonPressed: () =>
    trackEvent({
      category: EventCategory.Misc,
      action: 'Rate And Review Dialog Leave Review Button Pressed',
    }),

  trackInviteFriendsDialogShown: () =>
    trackEvent({
      category: EventCategory.Misc,
      action: 'Invite Friends Dialog Shown',
      nonInteraction: true,
    }),
  trackInviteFriendsDialogShareButtonPressed: () =>
    trackEvent({
      category: EventCategory.Misc,
      action: 'Invite Friends Dialog Share Button Pressed',
    }),
};
