import React, { useEffect, useState } from 'react';
import { faComment, faDiceD6 } from '@fortawesome/free-solid-svg-icons';
import { UserInfoRecord } from 'dstnd-io';
import { useSelector } from 'react-redux';
import { Tabs } from 'src/components/Tabs';
import { ActivityLog } from 'src/modules/Room/RoomActivityLog';
import { selectCurrentRoomActivityLog } from 'src/modules/Room/RoomActivityLog/redux/selectors';
import { ChatContainer } from 'src/modules/Chat';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { Room } from '../../types';

export type RoomTabsWidgetProps = {
  me: UserInfoRecord;
  bottomContainerHeight: number;
  room: Room;
};

export const RoomTabsWidget: React.FC<RoomTabsWidgetProps> = (props) => {
  const activityLog = useSelector(selectCurrentRoomActivityLog);
  const [tab, setTab] = useState(0);
  const { theme } = useColorTheme();

  useEffect(() => {
    if (
      activityLog.pending &&
      activityLog.pending.type === 'offer' &&
      props.me.id === activityLog.pending.toUser.id
    ) {
      // Go back to activity record if there is pending offer for me!
      setTab(0);
    }
  }, [activityLog.pending]);

  return (
    <Tabs
      currentTabIndex={tab}
      onTabChanged={setTab}
      tabs={[
        {
          title: 'Activity',
          content: (
            <div
              style={{
                borderColor: theme.colors.neutral,
                overflow: 'hidden',
                flex: 1,
              }}
            >
              <ActivityLog
                bottomContainerStyle={{
                  height: `${props.bottomContainerHeight}px`,
                }}
              />
            </div>
          ),
          icon: faDiceD6,
        },
        {
          title: 'Messages',
          content: (
            <div
              style={{
                borderColor: theme.colors.neutral,
                overflow: 'hidden',
                flex: 1,
              }}
            >
              <ChatContainer
                inputContainerStyle={{ height: `${props.bottomContainerHeight}px` }}
                room={props.room}
              />
            </div>
          ),
          icon: faComment,
        },
      ]}
    />
  );
};
