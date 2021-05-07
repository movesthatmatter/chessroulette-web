import { RoomRecord } from 'dstnd-io';
import React, { useEffect } from 'react';
import { Dialog, DialogProps } from 'src/components/Dialog/Dialog';
import { FaceTimeSetup } from 'src/components/FaceTime/FaceTimeSetup';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { noop } from 'src/lib/util';
import { Events } from 'src/services/Analytics';
import { useGenericRoomBouncer } from './useGenericRoomBouncer';

type Props = {
  roomInfo: RoomRecord;
  onReady?: () => void;
  onCancel?: () => void;
};

// TODO: This is also where the facebook login will be for Random!
export const GenericRoomBouncer: React.FC<Props> = ({
  onReady = noop,
  onCancel = noop,
  ...props
}) => {
  const cls = useStyles();
  const bouncer = useGenericRoomBouncer(props.roomInfo.slug);

  useEffect(() => {
    if (bouncer.state?.ready) {
      onReady();
    }
  }, [bouncer.state?.ready]);

  useEffect(() => {
    // Make sure the Browser Is Supported before anything else
    bouncer.checkBrowserSupport();
  }, []);

  if (bouncer.state?.ready) {
    return <>{props.children}</>;
  }

  // let the Global Bouncer Dialog deal with it!
  if (!bouncer.state?.browserIsSupported) {
    return null;
  }

  const dialogState = (() => {
    if (bouncer.state?.permissionsGranted === true) {
      return {
        title: 'Wow! You look ready! 😏',
        content: (
          <FaceTimeSetup
            onUpdated={(s) => {
              if (s.on) {
                // This is extra, as the Permissions are already granted here
                bouncer.checkPermissions();
              }
            }}
          />
        ),
        buttons: [
          {
            type: 'positive',
            label: "I'm ready to Join",
            withLoader: true,
            isLoading: bouncer.permissionsCheckLoading,
            disabled: !bouncer.state.permissionsGranted,
            onClick: () => {
              bouncer.confirm();

              Events.trackRoomJoiningConfirmed(props.roomInfo.type);
            },
          },
        ] as DialogProps['buttons'],
      }
    }

    else if (bouncer.state?.permissionsGranted === false) {
      return {
        title: 'Oh No!!',
        content: (
          <Text size="small1">
            Your Camera & Microphone Permissions are Off. Please use your Browser's settings to turn them On.
          </Text>
        ),
        buttons: [
          {
            type: 'positive',
            label: 'Try Again',
            withLoader: true,
            isLoading: bouncer.permissionsCheckLoading,
            onClick: () => {
              bouncer.checkPermissions();
            },
          },
        ] as DialogProps['buttons'],
      }
    }

    return {
      title: `Smile – You'll be on camera!`,
      content: (
        <Text size="small1" className={cls.centeredText}>
          Get the most out of your <strong>Chessroulette </strong>
          experience by allowing access to your camera and microphone.
        </Text>
      ),
      buttons: [
        {
          type: 'primary',
          label: 'Start my Camera',
          withLoader: true,
          isLoading: bouncer.permissionsCheckLoading,
          onClick: () => {
            bouncer.agreeWithPermissionsRequest();
            Events.trackAVPermissionsRequestAccepted(props.roomInfo.type);

            bouncer.checkPermissions();
          },
        },
      ] as DialogProps['buttons'],
    }
  })();


  return (
    <Dialog
      visible={!bouncer.state.ready}
      hasCloseButton={false}
      title={dialogState.title}
      content={dialogState.content}
      buttonsStacked
      buttons={[
        ...dialogState.buttons || [],
        {
          type: 'secondary',
          label: 'Cancel',
          onClick: () => {
            onCancel();

            Events.trackRoomJoiningCanceled(props.roomInfo.type);
          },
        },
      ]}
    />
  );
};

const useStyles = createUseStyles({
  centeredText: {
    textAlign: 'center',
  }
});