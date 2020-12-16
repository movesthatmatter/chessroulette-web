import { ISODateTime } from 'io-ts-isodatetime';

export type Rating = 'negative' | 'neutral' | 'positive';

export type SeenState =
  | {
      seen: false;
    }
  | {
      seen: true;
      lastSeenAt: ISODateTime;
      done: boolean;
    };

export type FeedbackState = {
  canShow: {
    anyStep: boolean;
    steps: {
      rating: boolean;
      friendsInvite: boolean;
    };
  };
  steps: {
    rating: SeenState;
    friendsInvite: SeenState;
  };
};

export type Steps = FeedbackState['steps'];
export type StepName = keyof Steps;
