import { ChallengeRecord } from 'chessroulette-io';
import { Text } from 'src/components/Text';
import React, { useState } from 'react';
import { AwesomeLoader } from 'src/components/AwesomeLoader';
import { ClipboardCopy } from 'src/components/ClipboardCopy';
import { createUseStyles } from 'src/lib/jss';
import { toChallengeUrlPath } from 'src/lib/util';
import useWebShare from 'react-use-web-share';
import { CustomTheme } from 'src/theme';

export type PendingChallengeProps = {
  challenge: ChallengeRecord;
};

export const PendingChallenge: React.FC<PendingChallengeProps> = (props) => {
  const cls = useStyles();
  const [_, setCopiedMagicLink] = useState(false);
  const { share } = useWebShare();

  return (
    <div className={cls.container}>
      <div className={cls.top}>
        <div className={cls.loader}>
          <AwesomeLoader minimal size="30%" />
        </div>
        {props.challenge.type === 'public' ? (
          <>
            <Text size="small1">
              Wait here for someone across the world to join or{' '}
              <strong>Share this Magic Link</strong> to a friend.
            </Text>
          </>
        ) : (
          <Text size="small1">Share the Magic Link with a friend!</Text>
        )}
      </div>
      <ClipboardCopy
        value={`${window.location.origin}/${toChallengeUrlPath(props.challenge)}`}
        autoCopy
        onCopied={() => {
          setCopiedMagicLink(true);

          try {
            share({
              title: ``,
              text: `You've been challenged to a game of chess 🧐! I'm waiting for you on `,
              url: `${window.location.origin}/${toChallengeUrlPath(props.challenge)}`,
            });
          } catch (e) {
            // do nothing. If the navigator.share doesn't eist it throws an error
            /// especially on desktop browsers!
          }
        }}
      />
      <Text size="small1">
        <strong className={cls.importantText}>
          Keep this pop-up open until your friend joins.
        </strong>
      </Text>
    </div>
  );
};

const useStyles = createUseStyles(theme => ({
  container: {
    textAlign: 'center',
  },
  loader: {},
  top: {
    paddingBottom: '8px',
  },
  importantText: {
    color: theme.colors.negative,
  },
}));
