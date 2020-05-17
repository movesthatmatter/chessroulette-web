import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { ColoredButton } from 'src/components/ColoredButton/ColoredButton';
import { Mutunachi, MutunachiProps } from 'src/components/Mutunachi/Mutunachi';
import { Peer } from 'src/components/RoomProvider';
import { GameChallengeRecord } from '../../records/GameDataRecord';

type Props = {
  challengeOffer: GameChallengeRecord;
  me: Peer;
  peers: Record<string, Peer>;

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

  if (challengeOffer.challengeeId === me.id) {
    return (
      <div className={cls.challengebyContainer}>
        {'You\'ve been challenged by '}
        <span className={cls.bold}>
          {`${peers[challengeOffer.challengerId].name}`}
        </span>
        <div className={cls.bottomPart}>
          <Mutunachi
            mid={me.avatarId}
            style={{ height: '100px' }}
          />
          <div className={cls.buttonsContainer}>
            <div style={{ marginBottom: '10px' }}>
              <ColoredButton
                label="Accept"
                color="#08D183"
                onClickFunction={() => props.onAccepted(challengeOffer)}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>VS</div>
            <ColoredButton
              label="Refuse"
              color="#E66162"
              onClickFunction={() => props.onRefused(challengeOffer)}
            />
          </div>
          <Mutunachi
            mid={peers[challengeOffer.challengerId].avatarId}
            style={{ height: '100px' }}
          />
        </div>
      </div>
    );
  }

  if (challengeOffer.challengerId === me.id) {
    return (
      <div className={cls.challengeContainer}>
        <Mutunachi
          mid={me.avatarId}
          style={{ height: '90px', marginBottom: '10px' }}
        />
        {'You\'re challenging '}
        <div className={cls.bold}>
          {`${peers[challengeOffer.challengeeId].name}`}
        </div>
        <span style={{ fontSize: '13px', marginTop: '10px' }}>Waiting for resonse...</span>
        <div className={cls.buttonsContainer}>
          <ColoredButton
            label="Cancel"
            color="#E66162"
            onClickFunction={() => props.onCancelled(challengeOffer)}
          />
        </div>
        <Mutunachi
          mid={peers[challengeOffer.challengeeId].avatarId}
          style={{ height: '90px' }}
        />
      </div>
    );
  }

  return (
    <div className={cls.randomChallengeContainer}>
      <Mutunachi
        mid={peers[challengeOffer.challengerId].avatarId}
        style={{ height: '90px' }}
      />
      <div className={cls.challengeText}>
        <span className={cls.bold} style={{ marginRight: '30px' }}>
          {`${peers[challengeOffer.challengerId].name}`}
        </span>
        challenges
        <span className={cls.bold} style={{ marginLeft: '30px' }}>
          {`${peers[challengeOffer.challengeeId].name}`}
        </span>
      </div>
      <Mutunachi
        mid={peers[challengeOffer.challengeeId].avatarId}
        style={{ height: '90px' }}
      />
    </div>
  );
};

const useStyles = createUseStyles({
  challengebyContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontFamily: 'Open Sans',
    fontSize: '16px',
    textAlign: 'center',
    width: '100%',
  },
  challengeContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontFamily: 'Open Sans',
    fontSize: '18px',
    textAlign: 'center',
  },
  randomChallengeContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    fontFamily: 'Open Sans',
    fontSize: '18px',
    textAlign: 'center',
  },
  bottomPart: {
    display: 'flex',
    width: '100%',
    marginTop: '20px',
    justifyContent: 'space-evenly',
  },
  buttonsContainer: {
    marginTop: '20px',

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
