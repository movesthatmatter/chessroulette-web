import { RoomRecord } from 'dstnd-io';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from 'src/components/Dialog/Dialog';
import { FaceTimeSetup } from 'src/components/FaceTimeArea/FaceTimeSetup';
import { Text } from 'src/components/Text';
import { noop } from 'src/lib/util';
import { Events } from 'src/services/Analytics';
import {
  confirmAction,
  grantPermissionsAction,
  agreePermissionsRequestAction,
} from './reducer';
import { selectroomBouncerState } from './selectors';

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
  const state = useSelector(selectroomBouncerState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (state.ready) {
      onReady();
    }
  }, [state.ready]);

  if (state.ready) {
    return <>{props.children}</>;
  }

  return (
    <Dialog
      visible={!state.ready}
      hasCloseButton={false}
      title={
        state.permissionsGranted ? "Smile – You're on camera!" : "Smile – You'll be on camera!"
      }
      content={
        <div
          style={{
            marginTop: '16px',
            textAlign: 'center',
          }}
        >
          {!(state.permissionsGranted || state.permissionsRequestAgreed) ? (
            <Text size="small1">
              To be able to get the most out of your <strong>Chessroulette</strong>
              experience you need to allow access to your camera and microphone.
            </Text>
          ) : (
            <FaceTimeSetup
              onUpdated={(s) => {
                if (s.on) {
                  dispatch(grantPermissionsAction());
                }
              }}
            />
          )}
        </div>
      }
      buttonsStacked
      buttons={[
        !(state.permissionsGranted || state.permissionsRequestAgreed)
          ? {
              type: 'primary',
              label: 'Start my Camera',
              onClick: () => {
                dispatch(agreePermissionsRequestAction());

                Events.trackAVPermissionsRequestAccepted(props.roomInfo.type);
              },
            }
          : {
              type: 'positive',
              label: "I'm ready to Join",
              disabled: !state.permissionsGranted,
              onClick: () => {
                dispatch(confirmAction());

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
