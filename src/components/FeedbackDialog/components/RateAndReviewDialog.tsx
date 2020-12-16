import React, { useEffect, useState } from 'react';
import useWebShare from 'react-use-web-share';
import { ClipboardCopy } from 'src/components/CipboardCopy';
import { Dialog } from 'src/components/Dialog/Dialog';
import { Emoji } from 'src/components/Emoji';
import { Text } from 'src/components/Text';
import { useWillUnmount } from 'src/lib/hooks/useWillUnmount';
import { createUseStyles } from 'src/lib/jss';
import { seconds } from 'src/lib/time';
import { Events } from 'src/services/Analytics';
import { Rating } from '../types';
import { useFeedbackDialog } from '../useFeedbackDialog';

type Props = {
  onDone: () => void;
  onPostponed: () => void;
};

export const RateAndReviewDialog: React.FC<Props> = (props) => {
  const cls = useStyles();
  const { share } = useWebShare();
  const feedbackDialog = useFeedbackDialog();
  const [rating, setRating] = useState<Rating>();

  useWillUnmount(() => {
    // The Actualy Rating is triggered on unmoount.
    //  This way if the dialog is somehow closed w/o
    //  the users interaction there's a chance it will
    // get tracked/saved
    if (rating) {
      feedbackDialog.finishRatingStep(rating);
    }
  }, [rating, feedbackDialog]);

  useEffect(() => {
    Events.trackFeedbackDialogSeen('Rating Step');
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
                {(!rating || rating === 'negative') && (
                  <Emoji
                    symbol="🙁"
                    className={cls.emoji}
                    onClick={() => {
                      setRating((prev) => {
                        return prev === 'negative' ? undefined : 'negative';
                      });
                    }}
                  />
                )}
                {(!rating || rating === 'neutral') && (
                  <Emoji
                    symbol="😐"
                    className={cls.emoji}
                    onClick={() => {
                      setRating((prev) => {
                        return prev === 'neutral' ? undefined : 'neutral';
                      });
                    }}
                  />
                )}
                {(!rating || rating === 'positive') && (
                  <Emoji
                    symbol="😄"
                    className={cls.emoji}
                    onClick={() => {
                      setRating((prev) => {
                        return prev === 'positive' ? undefined : 'positive';
                      });
                    }}
                  />
                )}
              </div>
            </div>
          }
          {rating && (
            <div
              style={{
                textAlign: 'center',
                paddingTop: '16px',
              }}
            >
              {rating === 'negative' && (
                <>
                  <Text size="small1" asParagraph>
                    <strong>Oh no!</strong>
                  </Text>
                  <Text size="small1">
                    Please take a second to let us know what went wrong and how we can improve.
                  </Text>
                </>
              )}

              {rating === 'neutral' && (
                <>
                  <Text size="small1" asParagraph>
                    <strong>Your Opinion Matters!</strong>
                  </Text>
                  <Text size="small1">
                    We're always looking for ways to improve our service. What can we do better?
                  </Text>
                </>
              )}
              {rating === 'positive' && (
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
                      // Wait a bit till I show the Thank You
                      setTimeout(() => {
                        props.onDone();
                      }, seconds(2));

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
        rating && {
          type: 'primary',
          label: {
            negative: 'Let me tell you!',
            neutral: 'Happy to help!',
            positive: 'Write us!',
          }[rating],
          onClick: () => {
            const subject = {
              negative: `I'm not happy with my experience`,
              neutral: `My experience was OK but...`,
              positive: 'I had a great experience!',
            }[rating];

            window.open(`mailto:feedback@chessroulette.org?subject=${subject}`);

            Events.trackFeedbackDialogReviewButtonPressed(rating);

            // Wait a bit to show the Thank You
            setTimeout(() => {
              props.onDone();
            }, seconds(1));
          },
        },
        rating
          ? {
              type: 'secondary',
              label: `Done`,
              onClick: props.onDone,
            }
          : {
              type: 'secondary',
              label: `I'll do it later`,
              onClick: () => {
                Events.trackFeedbackDialogPostponed('Rating Step');

                props.onPostponed();
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
