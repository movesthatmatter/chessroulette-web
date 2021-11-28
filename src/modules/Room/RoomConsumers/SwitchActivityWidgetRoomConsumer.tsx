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

type SwitchRoomRelayActivityRequestPayload = Extract<
SwitchRoomActivityRequestPayload['content'], 
{activityType : 'relay'}>

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

type RelaxedSwitchRoomRelayActivityRequestPayload = Partial<
Omit<SwitchRoomRelayActivityRequestPayload, 'activityType' | 'relayId'>
> & Pick<SwitchRoomRelayActivityRequestPayload, 'activityType'>;

type State =
  | RelaxedSwitchRoomPlayActivityRequestPayload
  | RelaxedSwitchRoomAnalsysActivityRequestPayload
  | RelaxedSwitchRoomNoActivityRequestPayload
  | RelaxedSwitchRoomRelayActivityRequestPayload;

type Props = {
  render: (
    p: { onSwitch: (s: State) => void, goLive: () => void } & NonNullable<RoomProviderContextState>
  ) => React.ReactNode;
};

export const SwitchActivityWidgetRoomConsumer: React.FC<Props> = (props) => {
  const context = useContext(RoomProviderContext);
  const [state, setState] = useState<State>();

  if (!context) {
    return null;
  }

  // Don't show if the user isn't the Host (creator of the room for now)
  //  But later we could give admin roles to other peers
  if (context.room.me.id !== context.room.createdBy) {
    return null;
  }

  return (
    <>
      {props.render({
        ...context,
        onSwitch: (s) => {
          if (s.activityType === 'analysis') {
            context.roomActions.switchActivity({
              ...s,
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
        goLive : () => {
          context.roomActions.goLive();
        }
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
