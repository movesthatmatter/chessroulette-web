import React, { useEffect } from 'react';
import useWebShare from 'react-use-web-share';
import { ClipboardCopy } from 'src/components/ClipboardCopy';
import { Dialog } from 'src/components/Dialog/Dialog';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { Events } from 'src/services/Analytics';
import { CustomTheme } from 'src/theme';
import { locale } from './locale';

type Props = {
  onDone: () => void;
};

export const InviteFriendsDialog: React.FC<Props> = (props) => {
  const cls = useStyles();
  const { share } = useWebShare();

  useEffect(() => {
    Events.trackFeedbackDialogSeen('Friends Invite Step');
  }, []);

  return (
    <Dialog
      visible
      graphic={
        <div
          style={{
            textAlign: 'center',
            paddingBottom: '16px',
          }}
        >
          <Mutunachi
            mid={1}
            width="100px"
            style={{
              width: '30%',
              display: 'inline',
            }}
          />
        </div>
      }
      hasCloseButton={false}
      title="Help us Spread the Word"
      content={
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <div className={cls.top}>
            <Text size="small1" asParagraph>
              <strong>Did you enjoy The Queen's Gambit show?</strong>
            </Text>
            <Text size="small1">
              Guess what! We're looking for the next{' '}
              <a
                target="_blank"
                href="https://www.newyorker.com/culture/on-television/the-queens-gambit-is-the-most-satisfying-show-on-television"
                className={cls.link}
              >
                Beth Harmon
              </a>{' '}
              and you can help us spread the word!
            </Text>
            <br />
            <br />
            <Text size="small1">Share this Magic Link with your friends!</Text>
          </div>

          <ClipboardCopy
            value={window.location.origin}
            onCopied={() => {
              Events.trackFeedbackDialogInviteFriendsShareButtonPressed();

              try {
                share({
                  title: ``,
                  text: locale.inviteFriendsSharedMessage,
                  url: `${window.location.origin}`,
                });
              } catch (e) {
                // do nothing. If the navigator.share doesn't eist it throws an error
                /// especially on desktop browsers!
              }
            }}
          />
        </div>
      }
      buttons={[
        {
          type: 'primary',
          label: `Done`,
          onClick: () => {
            props.onDone();
          },
        },
      ]}
    />
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  container: {},
  link: {
    color: theme.colors.neutralDarkest,
    fontFamily: 'Lato, Open Sans, sans serif',
  },
  top: {
    paddingBottom: '8px',
  },
}));
