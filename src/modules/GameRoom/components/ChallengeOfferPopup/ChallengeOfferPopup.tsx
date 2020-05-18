import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { ColoredButton } from 'src/components/ColoredButton/ColoredButton';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { Peer } from 'src/components/RoomProvider';
import { GameChallengeRecord } from '../../records/GameDataRecord';

type Props = {
  challengeOffer: GameChallengeRecord;
  challenger: Peer;
  challengee: Peer;
  meId: string;

  onAccepted: (offer: GameChallengeRecord) => void;
  onRefused: (offer: GameChallengeRecord) => void;
  onCancelled: (offer: GameChallengeRecord) => void;
};

export const ChallengeOfferPopup: React.FC<Props> = ({
  challengeOffer,
  challengee,
  challenger,
  meId,
  ...props
}) => {
  const cls = useStyles();

  if (challengeOffer.challengeeId === meId) {
    return (
      <div className={cls.container}>
        <div className={cls.grid}>
          <div className={cls.side}>
            <Mutunachi
              mid={challengee.avatarId}
              className={cls.mutunachi}
            />
          </div>

          <div className={cls.middle}>
            {'You\'ve been challenged by '}
            <span className={cls.bold}>
              {`${challenger.name}`}
            </span>


          </div>

          <div className={cls.side}>
            <Mutunachi
              mid={challenger.avatarId}
              className={cls.mutunachi}
            />
          </div>
        </div>
        <div className={cls.bottom}>
          <div className={cls.buttonsContainer}>
            <ColoredButton
              className={cls.button}
              label="Accept"
              color="#08D183"
              onClickFunction={() => props.onAccepted(challengeOffer)}
            />
            <ColoredButton
              className={cls.button}
              label="Refuse"
              color="#E66162"
              onClickFunction={() => props.onRefused(challengeOffer)}
            />
          </div>
        </div>
      </div>
    );
  }

  if (challengeOffer.challengerId === meId) {
    return (
      <div className={cls.container}>
        <div className={cls.grid}>
          <div className={cls.side}>
            <Mutunachi
              mid={challenger.avatarId}
              className={cls.mutunachi}
            />
          </div>
          <div className={cls.middle}>
            <div>
              {'You\'re challenging '}
              <div className={cls.bold}>
                {`${challengee.name}`}
              </div>
            </div>
            <div>
              <span>Waiting for response...</span>
            </div>
          </div>
          <div className={cls.side}>
            <Mutunachi
              mid={challengee.avatarId}
              className={cls.mutunachi}
            />
          </div>
        </div>
        <div className={cls.bottom}>
          <div className={cls.buttonsContainer}>
            <ColoredButton
              className={cls.button}
              label="Cancel"
              color="#E66162"
              onClickFunction={() => props.onCancelled(challengeOffer)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cls.container}>
      <div className={cls.grid}>
        <div className={cls.side}>
          <Mutunachi
            mid={challenger.avatarId}
            className={cls.mutunachi}
          />
        </div>

        <div className={cls.middle}>
          <div className={cls.challengeText}>
            <span className={cls.bold}>
              {`${challenger.name}`}
            </span>
            challenges
            <span className={cls.bold}>
              {`${challengee.name}`}
            </span>
          </div>
        </div>

        <div className={cls.side}>
          <Mutunachi
            mid={challengee.avatarId}
            className={cls.mutunachi}
          />
        </div>
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    maxWidth: '500px',
    fontFamily: 'Open Sans',
    fontSize: '16px',
    textAlign: 'center',
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
  },
  mutunachi: {
    width: '120px',
  },
  middle: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  side: {
    flex: 1,
    display: 'flex',
  },
  bottomPart: {},
  bottom: {},
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    justifyItems: 'space-between',
  },
  button: {
    marginLeft: '10px',
    marginRight: '10px',
  },
  challengeText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  bold: {
    fontWeight: 'bold',
  },
});
