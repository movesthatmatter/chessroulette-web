import capitalize from 'capitalize';
import { AsyncResult, RoomRecord, UserRecord } from 'dstnd-io';
import React from 'react';
import { Dialog, DialogProps } from 'src/components/Dialog/Dialog';
import { useBrowserSupportCheck } from 'src/modules/Room/RoomBouncer';
import { resources } from 'src/resources';
import { AcceptChallengeProps } from './AcceptChallenge';

type Props = Pick<DialogProps, 'title' | 'visible'> &
  AcceptChallengeProps & {
    user: UserRecord;
    onDenied: () => void;
    onAccepted: (r: RoomRecord) => void;
  };

export const AcceptChallengeDialog: React.FC<Props> = ({
  visible,
  title = `You've Been Challenged`,
  challenge,
  user,
  ...props
}) => {
  // TODO: Add them back
  const { isBrowserUnsupported, checkBrowserSupport } = useBrowserSupportCheck();

  if (isBrowserUnsupported) {
    return null;
  }

  return (
    <Dialog
      visible={visible}
      title={title}
      hasCloseButton={false}
      content={{
        __html: `Do you want to Play a <b>${capitalize(challenge.gameSpecs.timeLimit)}</b> game?`,
      }}
      buttons={[
        {
          type: 'secondary',
          label: 'Deny',
          onClick: props.onDenied,
        },
        {
          type: 'primary',
          label: 'Play',
          onClick: () => {
            // Make sure the browser is supported 
            //  before accepting the challenge
            // This is important because if the challenge gets created in the current unsupported browser
            //  and the User has to change Browsers, he won't be a Player anymore since he'll 
            //  join as different Guest User
            if (checkBrowserSupport()) {
              resources
                .acceptChallenge({
                  id: challenge.id,
                  userId: user.id,
                })
                .map(
                  AsyncResult.passThrough((room) => {
                    props.onAccepted(room);
                  })
                );
            }
          },
        },
      ]}
    />
  );
};
