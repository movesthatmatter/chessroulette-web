import React from 'react';
import { PeerRecord, RoomStatsRecord } from 'dstnd-io';
import { createUseStyles } from 'src/lib/jss';
import { ColoredButton } from 'src/components/ColoredButton/ColoredButton';
import { GameChallengeRecord } from '../../records/GameDataRecord';

type Props = {
  challengeOffer: GameChallengeRecord;
  me: PeerRecord;

  // This should be the new Peer Record
  //  not this aberation :)
  peers: RoomStatsRecord['peers'];

  onAccepted: (offer: GameChallengeRecord) => void;
  onRefused: (offer: GameChallengeRecord) => void;
  onCancelled: (offer: GameChallengeRecord) => void;
};

export const ChallengeOfferPopup: React.FC<Props> = ({
  challengeOffer,
  me,
  peers,
  ...props
}) => {
  const cls = useStyles();
  // console.log('works');

  if (challengeOffer.challengeeId === me.id) {
    return (
      <div>
        {`You've been challenged by ${peers[challengeOffer.challengerId].name}`}

        <div className={cls.buttonsContainer}>
          <ColoredButton
            label="Accept"
            onClickFunction={() => props.onAccepted(challengeOffer)}
          />
          <ColoredButton
            label="Refuse"
            onClickFunction={() => props.onRefused(challengeOffer)}
          />
        </div>
      </div>
    );
  }

  if (challengeOffer.challengerId === me.id) {
    return (
      <div>
        {`You're challenging ${peers[challengeOffer.challengeeId].name}`}

        <div className={cls.buttonsContainer}>
          <ColoredButton
            label="Cancel"
            onClickFunction={() => props.onCancelled(challengeOffer)}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      {`${peers[challengeOffer.challengerId].name} challenges ${peers[challengeOffer.challengeeId].name}`}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
  buttonsContainer: {

  },
});
