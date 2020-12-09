import { RoomRecord } from 'dstnd-io';
import React, { useEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Dialog } from 'src/components/Dialog/Dialog';
import { FaceTimeSetup } from 'src/components/FaceTimeArea/FaceTimeSetup';
import { noop } from 'src/lib/util';
import {
  confirmAction,
  grantPermissionsAction,
  agreePermissionsRequestAction,
  initialState,
  reducer,
} from './reducer';

type Props = {
  roomInfo?: RoomRecord;
  onReady?: () => void;
};

// TODO: This is also where the facebook login will be for Random!
export const GenericRoomBouncer: React.FC<Props> = ({
  onReady = noop,
  ...props
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const history = useHistory();

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
      content={
        <div style={{
          textAlign: 'center',
        }}>
          {!(state.permissionsGranted || state.permissionsRequestAgreed) ? (
            `Just a few more steps before you can join the room!`
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
              },
            }
          : {
              type: 'positive',
              label: 'Join Room',
              disabled: !state.permissionsGranted,
              onClick: () => {
                dispatch(confirmAction());
              },
            },
        {
          type: 'secondary',
          label: 'Take me back',
          onClick: () => {
            history.goBack();
          },
        },
      ]}
    />
  );
};
