import { RoomRecord } from 'dstnd-io';
import React, { useEffect } from 'react';
import { Dialog } from 'src/components/Dialog/Dialog';
import { FaceTimeSetup } from 'src/components/FaceTimeArea/FaceTimeSetup';
import { Text } from 'src/components/Text';
import { noop } from 'src/lib/util';
import { Events } from 'src/services/Analytics';
import { useGenericRoomBouncer } from './useGenericRoomBouncer';
import { BrowserNotSupportedDialog } from './components/BrowserNotSuppoortedDialog';

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
  const bouncer = useGenericRoomBouncer();

  useEffect(() => {
    if (bouncer.state.ready) {
      onReady();
    }
  }, [bouncer.state.ready]);

  useEffect(() => {
    bouncer.checkBrowserSupport();
  }, []);

  if (bouncer.state.ready) {
    return <>{props.children}</>;
  }

  if (!bouncer.state.browserIsSupported) {
    return <BrowserNotSupportedDialog visible />;
  }

  return (
    <Dialog
      visible={!bouncer.state.ready}
      hasCloseButton={false}
      title={
        bouncer.state.permissionsGranted
          ? "Smile – You're on camera!"
          : "Smile – You'll be on camera!"
      }
      content={
        <div
          style={{
            marginTop: '16px',
            textAlign: 'center',
          }}
        >
          {!(bouncer.state.permissionsGranted || bouncer.state.permissionsRequestAgreed) ? (
            <Text size="small1">
              To be able to get the most out of your <strong>Chessroulette</strong>
              experience you need to allow access to your camera and microphone.
            </Text>
          ) : (
            <FaceTimeSetup
              onUpdated={(s) => {
                if (s.on) {
                  bouncer.checkPermissions();
                }
              }}
            />
          )}
        </div>
      }
      buttonsStacked
      buttons={[
        !(bouncer.state.permissionsGranted || bouncer.state.permissionsRequestAgreed)
          ? {
              type: 'primary',
              label: 'Start my Camera',
              onClick: () => {
                bouncer.agreeWithPermissionsRequest();

                Events.trackAVPermissionsRequestAccepted(props.roomInfo.type);
              },
            }
          : {
              type: 'positive',
              label: "I'm ready to Join",
              disabled: !bouncer.state.permissionsGranted,
              onClick: () => {
                bouncer.confirm();

                Events.trackRoomJoiningConfirmed(props.roomInfo.type);
              },
            },
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
