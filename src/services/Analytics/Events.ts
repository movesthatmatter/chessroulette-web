import capitalize from 'capitalize';
import ReactGA from 'react-ga';

type EventCategory = 'User' | 'Game - Chess' | 'Player - Chess' | 'Chat';

const trackEvent = ({
  category,
  action,
  description,
  ...rest
}: {
  category: EventCategory,
  action: string,
  value?: number,
  description?: string,
  nonInteraction?: boolean,
}) => {
  ReactGA.event({
    category,
    action,

    ...description && {
      label: description,
    },

    ...rest,
  })
}

type ChallengeType = 'Friendly Challenge' | 'Quick Pairing';
type GameEndedReason = 
  | 'Check Mate'
  | 'Draw Accepted'
  | 'Resignation'
  | 'Abortion'
  | 'Time Finished'
  | 'Stalemate'
  | 'Threefold Repetition';

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

  trackChallengeCreated: (type: ChallengeType) => trackEvent({
    category: 'User',
    action: 'Challenge Created',
    description: type,
  }),

  trackFriendlyChallengeAccepted: () => trackEvent({
    category: 'User',
    action: 'Friendly Challenge Accepted',
  }),

  trackQuickPairingMatched: () => trackEvent({
    category: 'User',
    action: 'Quick Pairing Matched',
  }),

  trackDrawOffered: () => trackEvent({
    category: 'Player - Chess',
    action: 'Draw Offered',
  }),

  trackDrawAccepted: () => trackEvent({
    category: 'Player - Chess',
    action: 'Draw Accepted',
  }),

  trackDrawDenied: () => trackEvent({
    category: 'Player - Chess',
    action: 'Draw Denied',
  }),

  trackResigned: () => trackEvent({
    category: 'Player - Chess',
    action: 'Resigned',
  }),

  trackAborted: () => trackEvent({
    category: 'Player - Chess',
    action: 'Aborted',
  }),

  trackRematchOffered: () => trackEvent({
    category: 'Player - Chess',
    action: 'Rematch Offered',
  }),

  trackRematchDenied: () => trackEvent({
    category: 'Player - Chess',
    action: 'Rematch Denied',
  }),

  trackRematchAccepted: () => trackEvent({
    category: 'Player - Chess',
    action: 'Rematch Accepted',
  }),

  trackGameStarted: (color: 'white' | 'black') => trackEvent({
    category: 'Game - Chess',
    action: 'Game Started',
    description: capitalize(color),
  }),

  trackGameEnded: (reason: 'finished' | 'stopped') => trackEvent({
    category: 'Game - Chess',
    action: 'Game Ended',
    description: capitalize(reason),
  }),

  trackChatMessageSent: () => trackEvent({
    category: 'Chat',
    action: 'Message Sent',
  }),
  // trackMoveMade: (color: 'white' | 'black') => trackEvent({
  //   category: 'Game - Chess',
  //   action: 'Move Made',
  //   description: capitalize(color),
  // }),
};