import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Layer, Box } from 'grommet';
import { UserRecord } from 'dstnd-io';
import { Result } from 'ts-results';
import { useHistory } from 'react-router-dom';
import { createRoom } from 'src/resources/resources';
import { OnboardingForm, OnboardingFormProps } from '../OnboardingForm';

type Props = Pick<OnboardingFormProps, 'mode'> & {
  onSetUser: (
    userInfo: { name: string },
  ) => Promise<Result<UserRecord, unknown>>;
};

const toRoomPath = (room: {
  id: string;
  type: 'public' | 'private';
  code?: string;
}) => `${room.id}${room.type === 'private' ? `/${room.code}` : ''}`;

export const OnboardingWidget: React.FC<Props> = (props) => {
  const cls = useStyles();
  const history = useHistory();

  return (
    <OnboardingForm
      mode={props.mode}
      onCreateClassroom={async (input) => {
        (await props.onSetUser({ name: input.userName }))
          .map((user) => createRoom({
            nickname: 'my room',
            type: 'private',
            peerId: user.id,
          }))
          .map(async (roomPromise) => {
            (await roomPromise).map((room) => {
              history.push(`/classroom/${toRoomPath(room)}`);
            });
          });
      }}
      onJoinClassroom={async (input) => {
        (await props.onSetUser({ name: input.userName }));
      }}
    />
  );
};

const useStyles = createUseStyles({
  container: {
    borderRadius: '24px !important',
  },
});
