import { ChallengeRecord, RoomRecord } from 'chessroulette-io';
import React, { useEffect } from 'react';
import { Page } from 'src/components/Page';
import { Events } from 'src/services/Analytics';
import { ChallengeWidget } from './Widgets/ChallengeWidget';

type Props = {
  challenge: ChallengeRecord;
  onAccepted: (r: RoomRecord) => void;
  onMatched: (r: RoomRecord) => void;
  onDenied: () => void;
  onCanceled: () => void;
};

export const ChallengePage: React.FC<Props> = (props) => {
  return (
    <Page doNotTrack name="Challenge Page">
      <ChallengeWidget
        challenge={props.challenge}
        onAccepted={props.onAccepted}
        onMatched={props.onMatched}
        onDenied={props.onDenied}
        onCanceled={props.onCanceled}
      />
    </Page>
  );
};
