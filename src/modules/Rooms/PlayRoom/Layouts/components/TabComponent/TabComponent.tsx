import React, { useState } from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { colors, fonts } from 'src/theme';

type TabProps = {
  content: string | React.ReactNode;
  icon: React.ReactNode | null;
  title: string;
};

type TabComponentProps = {
  tabs: TabProps[];
};

export const TabComponent: React.FC<TabComponentProps> = ({ tabs }) => {
  const cls = useStyles();
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <div className={cls.container}>
      <div className={cls.tabBar}>
        {tabs.map((tab, index) => (
          <>
            <div className={cls.tabButton} onClick={() => setCurrentTab(index)}>
              <Text
                style={{
                  ...fonts.subtitle2,
                }}
              >
                {tab.icon}
                {tab.title}
              </Text>
            </div>
          </>
        ))}
      </div>
      {tabs[currentTab].content}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height : '100%'
  },
  tabBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  tabButton: {
    paddingTop: '16px',
    paddingBottom: '8px',
    borderBottom: '1px solid',
    borderColor: colors.neutral,
  },
});
