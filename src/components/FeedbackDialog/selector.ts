import { RootState } from 'src/redux/rootReducer';

export const selectFeedback = ({ session }: RootState) => session.feedbackDialog;
