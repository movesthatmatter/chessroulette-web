import React from 'react';
import capitalize from 'capitalize';
import { RoomChallengeRecord } from 'dstnd-io';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import { AwesomeLoader } from 'src/components/AwesomeLoader';
import { DialogContent } from 'src/components/Dialog';
import { Text } from 'src/components/Text';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { formatTimeLimit } from 'src/modules/GamesArchive/components/ArchivedGame/util';
import { resources } from 'src/modules/Room';
import { useRoomConsumer } from 'src/modules/Room/RoomConsumers/useRoomConsumer';
import { getUserDisplayName } from 'src/modules/User';
import { colors, floatingShadow, onlyMobile, softBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { noop } from 'src/lib/util';

type Props = {
  pendingChallenge: RoomChallengeRecord;
  onDismiss?: () => void;
};

export const AcceptChallengeDialog: React.FC<Props> = ({ pendingChallenge, onDismiss = noop }) => {
  const cls = useStyles();
  const roomConsumer = useRoomConsumer();

  return (
    <div className={cls.container}>
      <div className={cls.dialog}>
        <DialogContent
          title={`${getUserDisplayName(pendingChallenge.createdByUser)} Created a Challenge`}
          hasCloseButton={false}
          contentContainerClass={cls.dialogContent}
          content={
            <>
              <div className={cls.centered}>
                <Text size="body2">
                  <strong>{' ' + capitalize(pendingChallenge.gameSpecs.timeLimit) + ' '}</strong>(
                  {formatTimeLimit(chessGameTimeLimitMsMap[pendingChallenge.gameSpecs.timeLimit])})
                  Game
                </Text>
                {/* <div className={cls.spacer} /> */}
              </div>
            </>
          }
          graphic={<AwesomeLoader minimal size="30%" />}
          buttonsStacked
          buttonsContainerClass={cls.buttonsContainer}
          buttons={[
            {
              label: 'Accept',
              type: 'primary',
              onClick: () => {
                if (!roomConsumer) {
                  return;
                }

                resources.acceptRoomChallenge({
                  challengeId: pendingChallenge.id,
                  roomId: pendingChallenge.roomId,
                });
              },
            },
            {
              label: 'Dismiss',
              type: 'secondary',
              onClick: onDismiss,
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
    paddingTop: spacers.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    paddingTop: spacers.get(0.75),
  },
  copyToClipboardBtn: {
    marginTop: spacers.small,
    marginBottom: 0,
  },
  analysisButton: {
    marginTop: spacers.default,
    marginBottom: 0,
  },
  spacer: {
    paddingBottom: spacers.default,
  },
});
