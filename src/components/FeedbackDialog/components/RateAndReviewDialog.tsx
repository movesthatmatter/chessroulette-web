import React, { useEffect, useRef, useState } from 'react';
import useWebShare from 'react-use-web-share';
import { ClipboardCopy } from 'src/components/CipboardCopy';
import { Dialog } from 'src/components/Dialog/Dialog';
import { Emoji } from 'src/components/Emoji';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { Events } from 'src/services/Analytics';
import { useSession } from 'src/services/Session';

type AnswerMood = 'negative' | 'neutral' | 'positive';

type Props = {};

export const RateAndReviewDialog: React.FC<Props> = () => {
  const cls = useStyles();
  const [answer, setAnswer] = useState<AnswerMood>();
  const { share } = useWebShare();
  const session = useSession();
  const answerRef = useRef<AnswerMood>();

  const respond = () => {
    if (answerRef.current) {
      session.respondToFeedbackDialog(answerRef.current);
    }
  };

  useEffect(() => {
    answerRef.current = answer;
  }, [answer]);

  useEffect(() => {
    // On Unmount attempt to save the state if answered
    return respond;
  }, []);

  useEffect(() => {
    Events.trackRateAndReviewDialogShown();
  }, []);

  return (
    <Dialog
      visible
      hasCloseButton={false}
      title={`Psss! How was your experience?`}
      content={
        <>
          {
            <div>
              <div
                style={{
                  fontSize: '80px',
                  lineHeight: '80px',
                  display: 'flex',
                  justifyContent: 'space-around',
                  flexDirection: 'row',
                  flex: 1,
                }}
              >
                {(!answer || answer === 'negative') && (
                  <Emoji
                    symbol="🙁"
                    className={cls.emoji}
                    onClick={() => {
                      setAnswer((prev) => {
                        return prev === 'negative' ? undefined : 'negative';
                      });
                    }}
                  />
                )}
                {(!answer || answer === 'neutral') && (
                  <Emoji
                    symbol="😐"
                    className={cls.emoji}
                    onClick={() => {
                      setAnswer((prev) => {
                        return prev === 'neutral' ? undefined : 'neutral';
                      });
                    }}
                  />
                )}
                {(!answer || answer === 'positive') && (
                  <Emoji
                    symbol="😄"
                    className={cls.emoji}
                    onClick={() => {
                      setAnswer((prev) => {
                        return prev === 'positive' ? undefined : 'positive';
                      });
                    }}
                  />
                )}
              </div>
            </div>
          }
          {answer && (
            <div
              style={{
                textAlign: 'center',
                paddingTop: '16px',
              }}
            >
              {answer === 'negative' && (
                <>
                  <Text size="small1" asParagraph>
                    <strong>Oh no!</strong>
                  </Text>
                  <Text size="small1">
                    Please take a second to let us know what went wrong and how we can improve.
                  </Text>
                </>
              )}

              {answer === 'neutral' && (
                <>
                  <Text size="small1" asParagraph>
                    <strong>Your Opinion Matters!</strong>
                  </Text>
                  <Text size="small1">
                    We're always looking for ways to improve our service. What can we do better?
                  </Text>
                </>
              )}
              {answer === 'positive' && (
                <>
                  <div className={cls.top}>
                    <Text size="small1" asParagraph>
                      <strong>That's Spectacular!</strong>
                    </Text>
                    <Text size="small1">
                      Guess what! We're looking for the next <strong>Beth Harmon</strong> and you
                      can help us spread the word!
                    </Text>
                    <br />
                    <br />
                    <Text size="small1">Share this Magic Link with your friends!</Text>
                  </div>

                  <ClipboardCopy
                    value={window.location.origin}
                    onCopied={() => {
                      try {
                        share({
                          title: ``,
                          text: `
                            Hey, have you heard of ${window.location.origin}?
                            It's a new chess platform that allows you to video-chat with your friends while playing a game. 
                            I thought you might be a good fit! 😉`,
                          url: `${window.location.origin}`,
                        });
                      } catch (e) {
                        // do nothing. If the navigator.share doesn't eist it throws an error
                        /// especially on desktop browsers!
                      }
                    }}
                  />
                </>
              )}
            </div>
          )}
        </>
      }
      buttonsStacked
      buttons={[
        answer && {
          type: 'primary',
          label: {
            negative: 'Let me tell you!',
            neutral: 'Happy to help!',
            positive: 'Write us!',
          }[answer],
          onClick: () => {
            const subject = {
              negative: `I'm not happy with my experience`,
              neutral: `My experience was OK but...`,
              positive: 'I had a great experience!',
            }[answer];

            window.open(`mailto:feedback@chessroulette.org?subject=${subject}`);

            Events.trackRateAndReviewDialogLeaveReviewButtonPressed();
          },
        },
        answer
          ? {
              type: 'secondary',
              label: `Done`,
              onClick: () => {
                respond();
                session.closeFeedbackDialogForNow();
              },
            }
          : {
              type: 'secondary',
              label: `I'll do it later`,
              onClick: () => {
                session.postponeFeedback();
                session.closeFeedbackDialogForNow();
              },
            },
      ]}
    />
  );
};

const useStyles = createUseStyles({
  container: {},
  emoji: {
    cursor: 'pointer',
    transition: '100ms',

    '&:hover': {
      transform: 'scale(1.15)',
    },
  },
  top: {
    paddingBottom: '8px',
  },
});
