import React, { useState } from 'react';
import { ChallengeRecord } from 'chessroulette-io';
import { Button, ButtonProps } from 'src/components/Button';
import { toRoomUrlPath } from 'src/lib/util';
import { useHistory } from 'react-router-dom';
import { ChallengeWidget } from 'src/modules/Challenges/Widgets/ChallengeWidget/ChallengeWidget';
import { useMyPeer } from 'src/providers/PeerConnectionProvider';

type Props = Omit<ButtonProps, 'onClick'> & {
  challengeType: ChallengeRecord['type'];
};

export const ChallengeButtonWidget: React.FC<Props> = ({ challengeType, ...buttonProps }) => {
  const [visiblePopup, setVisiblePopup] = useState<boolean>(false);
  const myPeer = useMyPeer();
  const history = useHistory();

  return (
    <>
      <Button
        onClick={() => {
          setVisiblePopup(true)
        }}
        {...buttonProps}
        disabled={!myPeer || buttonProps.disabled}
      />
      {visiblePopup && (
        <ChallengeWidget
          challengeType={challengeType}
          onCanceled={() => setVisiblePopup(false)}
          onAccepted={(room) => {
            history.push(toRoomUrlPath(room));
          }}
          onMatched={(room) => {
            history.push(toRoomUrlPath(room));
          }}
        />
      )}
    </>
  );
};
