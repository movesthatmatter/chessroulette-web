import React, { useContext, useState } from 'react';
import { JoinedRoomProviderContext, JoinedRoomProviderContextState } from '../JoinedRoomProvider';
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
  { activityType: 'relay' }
>;

type SwitchRoomMeetupActivityRequestPayload = Extract<
  SwitchRoomActivityRequestPayload['content'],
  { activityType: 'meetup' }
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

type RelaxedSwitchRoomRelayActivityRequestPayload = Partial<
  Omit<SwitchRoomRelayActivityRequestPayload, 'activityType' | 'relayId'>
> &
  Pick<SwitchRoomRelayActivityRequestPayload, 'activityType'>;

type RelaxedSwitchRoomMeetupActivityRequestPayload = Partial<
  Omit<SwitchRoomMeetupActivityRequestPayload, 'activityType'>
> &
  Pick<SwitchRoomMeetupActivityRequestPayload, 'activityType'>;

type State =
  | RelaxedSwitchRoomPlayActivityRequestPayload
  | RelaxedSwitchRoomAnalsysActivityRequestPayload
  | RelaxedSwitchRoomNoActivityRequestPayload
  | RelaxedSwitchRoomRelayActivityRequestPayload
  | RelaxedSwitchRoomMeetupActivityRequestPayload;

type Props = {
  render: (
    p: {
      onSwitch: (s: State) => void;
      goLive: () => void;
      toggleInMeetup: (inMeetup: boolean) => void;
    } & NonNullable<JoinedRoomProviderContextState>
  ) => React.ReactNode;
};

export const SwitchActivityWidgetRoomConsumer: React.FC<Props> = (props) => {
  const context = useContext(JoinedRoomProviderContext);
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
              activityType: 'analysis',
              source: 'empty',

              // TODO: This were taken out but not sure if the "...s" is needed!
              // ...s,
              // history: s.history || [],
            });
          } else if (s.activityType === 'play') {
            if (getRoomPendingChallenge(context.room)) {
              context.roomActions.switchActivity({
                activityType: 'none',
              });
            } else {
              setState(s);
            }
          } else if (s.activityType === 'relay') {
            // don't do anything if relay as goLive takes care of it!
          } else {
            context.roomActions.switchActivity(s);
          }
        },
        goLive: () => {
          context.roomActions.goLive();
        },
        toggleInMeetup: (inMeetup: boolean) => {
          context.roomActions.toggleInMeetup(inMeetup);
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
