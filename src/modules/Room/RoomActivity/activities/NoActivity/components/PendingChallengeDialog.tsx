import capitalize from 'capitalize';
import { RoomChallengeRecord } from 'dstnd-io';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import React, { useEffect, useState } from 'react';
import { AwesomeLoader } from 'src/components/AwesomeLoader';
import { Button } from 'src/components/Button';
import { ClipboardCopyButton } from 'src/components/ClipboardCopy';
import { DialogContent } from 'src/components/Dialog';
import { Hr } from 'src/components/Hr';
import { Text } from 'src/components/Text';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { seconds } from 'src/lib/time';
import { toChallengeUrlPath } from 'src/lib/util';
import { formatTimeLimit } from 'src/modules/GamesArchive/components/ArchivedGame/util';
import { resources } from 'src/modules/Room';
import { useRoomConsumer } from 'src/modules/Room/RoomConsumers/useRoomConsumer';
import { Events } from 'src/services/Analytics';
import { colors, floatingShadow, onlyMobile, softBorderRadius } from 'src/theme';
import { useDeviceSize } from 'src/theme/hooks/useDeviceSize';
import { spacers } from 'src/theme/spacers';
import { setTimeout } from 'window-or-global';

type Props = {
  pendingChallenge: RoomChallengeRecord;
};

export const PendingChallengeDialog: React.FC<Props> = ({ pendingChallenge }) => {
  const cls = useStyles();
  const roomConsumer = useRoomConsumer();
  const [canShowOtherActivities, setCanShowotherActivities] = useState(false);
  const deviceSize = useDeviceSize();

  useEffect(() => {
    setTimeout(() => {
      setCanShowotherActivities(true);
    }, seconds(5));
  }, []);

  return (
    <div className={cls.container}>
      <div className={cls.dialog}>
        <DialogContent
          title="Your Challenge is pending..."
          hasCloseButton={false}
          contentContainerClass={cls.dialogContent}
          // content="While you're waiting"
          content={
            <>
              <div className={cls.centered}>
                <Text size="body2">
                  Waiting for someone to join your
                  <br />{' '}
                  <strong>{' ' + capitalize(pendingChallenge.gameSpecs.timeLimit) + ' '}</strong>(
                  {formatTimeLimit(chessGameTimeLimitMsMap[pendingChallenge.gameSpecs.timeLimit])})
                  Game
                </Text>
                <div className={cls.spacer} />
              </div>
              {canShowOtherActivities && deviceSize.isDesktop && (
                <>
                  <Hr text="Oh, btw" />
                  <div className={cls.centered}>
                    <Text size="body2">While waiting you can now also</Text>
                    <Button
                      label="Analyse Games"
                      clear
                      size="medium"
                      className={cls.analysisButton}
                      withBadge={{
                        text: 'New',
                        side: 'right',
                        color: 'negativeLight',
                      }}
                      onClick={() => {
                        if (!roomConsumer) {
                          return;
                        }

                        roomConsumer.roomActions.switchActivity({
                          activityType: 'analysis',
                          history: [],
                        });
                      }}
                    />
                  </div>
                  <div className={cls.spacer} />
                </>
              )}

              <div className={cls.centered}>
                {/* <Text size="small1">Share the Magic Link with a friend!</Text> */}
                {/* <br/> */}
                <Text size="small1" color={colors.negative}>
                  Share the Magic Link with a friend!
                </Text>
              </div>

              <ClipboardCopyButton
                label="Invite Friend"
                copiedlLabel="Challenge Link Copied"
                value={`${window.location.origin}/${toChallengeUrlPath(pendingChallenge)}`}
                full
                className={cls.copyToClipboardBtn}
              />
            </>
          }
          graphic={<AwesomeLoader minimal size="30%" />}
          buttonsStacked
          buttonsContainerClass={cls.buttonsContainer}
          buttons={[
            {
              label: 'Cancel Challenge',
              type: 'secondary',
              onClick: () => {
                if (!roomConsumer) {
                  return;
                }

                resources.deleteRoomChallenge({
                  challengeId: pendingChallenge.id,
                  roomId: pendingChallenge.roomId,
                }).map(() => {
                  Events.trackRoomChallengeCanceled(pendingChallenge);
                });
              },
            },
          ]}
        />
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    background: `rgba(0, 0, 0, .3)`,
    zIndex: 9,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    ...floatingShadow,
    ...softBorderRadius,
    padding: 0,
    position: 'relative',
    background: colors.white,

    ...makeImportant({
      borderRadius: '8px',
      minWidth: '240px',
      maxWidth: '360px',
      width: '60%',
    }),

    ...onlyMobile({
      ...makeImportant({
        width: '84%',
        maxWidth: 'none',
      }),
    }),
  },
  dialogContent: {
    paddingBottom: 0,
  },
  centered: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacers.default,

    ...onlyMobile({
      paddingTop: spacers.smaller,
    }),
  },
  buttonsContainer: {
    paddingTop: spacers.get(0.75),

    ...onlyMobile({
      paddingTop: 0,
    }),
  },
  copyToClipboardBtn: {
    marginTop: spacers.small,
    marginBottom: 0,

    ...onlyMobile({
      ...makeImportant({
        marginBottom: spacers.small,
      }),
    }),
  },
  analysisButton: {
    marginTop: spacers.default,
    marginBottom: 0,
  },
  spacer: {
    paddingBottom: spacers.default,

    ...onlyMobile({
      paddingBottom: spacers.smaller,
    }),
  },
});
