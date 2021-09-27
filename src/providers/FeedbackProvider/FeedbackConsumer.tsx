import React from 'react';
import { FeedbackDialogContext, FeedbackDialogContextState } from './FeedbackContext';

type Props = {
  render: (p: FeedbackDialogContextState) => React.ReactNode;
};

export const FeedbackDialogConsumer: React.FC<Props> = ({ render }) => {
  return (
    <>
      <FeedbackDialogContext.Consumer>
        {(state) => <>{render(state)}</>}
      </FeedbackDialogContext.Consumer>
    </>
  );
};
