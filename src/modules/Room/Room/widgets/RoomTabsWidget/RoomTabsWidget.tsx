import React, { useEffect, useState } from 'react';
import { faComment, faList } from '@fortawesome/free-solid-svg-icons';
import { UserInfoRecord } from 'dstnd-io';
import { useSelector } from 'react-redux';
import { Tabs } from 'src/components/Tabs';
import { ActivityLog } from 'src/modules/Room/ActivityLog';
import { selectCurrentRoomActivityLog } from 'src/modules/Room/ActivityLog/redux/selectors';
import { ChatContainer } from 'src/modules/Chat';
import { colors } from 'src/theme';

type Props = {
  me: UserInfoRecord;
  bottomContainerHeight: number;
};

export const RoomTabsWidget: React.FC<Props> = (props) => {
  const activityLog = useSelector(selectCurrentRoomActivityLog);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (activityLog.pending && props.me.id === activityLog.pending.toUser.id) {
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
          title: 'Activity Log',
          content: (
            <div
              style={{
                borderColor: colors.neutral,
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
          icon: faList,
        },
        {
          title: 'Messages',
          content: (
            <div
              style={{
                borderColor: colors.neutral,
                overflow: 'hidden',
                flex: 1,
              }}
            >
              <ChatContainer inputContainerStyle={{ height: `${props.bottomContainerHeight}px` }} />
            </div>
          ),
          icon: faComment,
        },
      ]}
    />
  );
};
