import React, { useContext, useState } from 'react';
import { RoomProviderContext, RoomProviderContextState } from '../RoomProvider';
import { SwitchRoomActivityRequestPayload } from 'dstnd-io';
import { CreateChallengeDialog } from '../RoomActivity/activities/components/CreateChallengeDialog';
import { getRoomPendingChallenge } from '../util';

type SwitchRoomPlayActivityRequestPayload = Extract<
  SwitchRoomActivityRequestPayload['content'],
  { activityType: 'play' }
>;

type SwitchRoomAnalysisActivityRequestPayload = Extract<
  SwitchRoomActivityRequestPayload['content'],
  { activityType: 'analysis' }
>;

type SwitchRoomNoActivityRequestPayload = Extract<
  SwitchRoomActivityRequestPayload['content'],
  { activityType: 'none' }
>;

type RelaxedSwitchRoomPlayActivityRequestPayload = Partial<
  Omit<SwitchRoomPlayActivityRequestPayload, 'activityType'>
> &
  Pick<SwitchRoomPlayActivityRequestPayload, 'activityType'>;

type RelaxedSwitchRoomAnalsysActivityRequestPayload = Partial<
  Omit<SwitchRoomAnalysisActivityRequestPayload, 'activityType'>
> &
  Pick<SwitchRoomAnalysisActivityRequestPayload, 'activityType'>;

type RelaxedSwitchRoomNoActivityRequestPayload = Partial<
  Omit<SwitchRoomNoActivityRequestPayload, 'activityType'>
> &
  Pick<SwitchRoomNoActivityRequestPayload, 'activityType'>;

type State =
  | RelaxedSwitchRoomPlayActivityRequestPayload
  | RelaxedSwitchRoomAnalsysActivityRequestPayload
  | RelaxedSwitchRoomNoActivityRequestPayload;

type Props = {
  render: (
    p: { onSwitch: (s: State) => void } & NonNullable<RoomProviderContextState>
  ) => React.ReactNode;
};

export const SwitchActivityWidgetRoomConsumer: React.FC<Props> = (props) => {
  const context = useContext(RoomProviderContext);
  const [state, setState] = useState<State>();

  if (!context) {
    return null;
  }

  return (
    <>
      {props.render({
        ...context,
        onSwitch: (s) => {
          if (s.activityType === 'analysis') {
            context.roomActions.switchActivity({
              activityType: 'analysis',
              history: s.history || [],
            });
          } else if (s.activityType === 'play') {
            if (getRoomPendingChallenge(context.room)) {
              context.roomActions.switchActivity({
                activityType: 'none',
              });
            } else {
              setState(s);
            }
          } else if (s.activityType === 'none') {
            context.roomActions.switchActivity({
              activityType: 'none',
            });
          }
        },
      })}
      {state?.activityType === 'play' && (
        <CreateChallengeDialog
          visible
          initialGameSpecs={state.gameSpecs}
          onCancel={() => setState(undefined)}
          onSuccess={() => setState(undefined)}
        />
      )}
    </>
  );
};