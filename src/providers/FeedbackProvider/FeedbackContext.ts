import { createContext } from 'react';
import { noop } from 'src/lib/util';

export type FeedbackDialogContextState = {
  visible: boolean;
  attemptToShowIfPossible: () => void;
  forcefullyShow: () => void;
};

export const FeedbackDialogContext = createContext<FeedbackDialogContextState>({
  visible: false,
  attemptToShowIfPossible: noop,
  forcefullyShow: noop,
});
