import React, { useState } from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { colors, fonts } from 'src/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faListAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type TabProps = {
  content: string | React.ReactNode;
  icon: IconProp | null;
  title: string;
};

type TabComponentProps = {
  tabs: TabProps[];
};

export const TabComponent: React.FC<TabComponentProps> = ({ tabs }) => {
  const cls = useStyles();
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <>
      <div className={cls.tabBar}>
        {tabs.map((tab, index) => (
          <>
            <div className={cls.tabButton} onClick={() => setCurrentTab(index)}>
              <Text
                style={currentTab === index ? {
                  ...fonts.subtitle2,
                } : {
                  ...fonts.subtitle2,
                  fontWeight:'normal'
                }}
              >
                {tab.icon && <FontAwesomeIcon
                        icon={tab.icon}
                        size="lg"
                        color={currentTab === index ? colors.primary :  colors.neutral}
                        style={{
                          marginRight: '8px',
                        }}
                />}
                {tab.title}
              </Text>
            </div>
          </>
        ))}
      </div>
      {tabs[currentTab].content}
    </>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height:'100%',
  },
  tabBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  tabButton: {
    paddingTop: '16px',
    paddingBottom: '8px',
    borderColor: colors.neutral,
    borderBottom: '2px solid transparent',
    '&:hover':{
      borderBottom: '2px solid',
      cursor:'pointer'
    }
  },
});
