import { useContext } from 'react';
import { FeedbackDialogContext } from './FeedbackContext';

export const useFeedbackActions = () => useContext(FeedbackDialogContext);
