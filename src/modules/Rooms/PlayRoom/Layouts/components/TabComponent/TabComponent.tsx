import React, { useState } from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles, makeImportant, NestedCSSElement } from 'src/lib/jss';
import { colors, fonts } from 'src/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { spacers } from 'src/theme/spacers';

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
                className={cls.tabButtonText}
                style={
                  currentTab === index
                    ? {
                        ...fonts.subtitle2,
                      }
                    : {
                        ...fonts.subtitle2,
                        fontWeight: 'normal',
                      }
                }
              >
                {tab.icon && (
                  <FontAwesomeIcon
                    icon={tab.icon}
                    className={cls.tabButtonIcon}
                    size="lg"
                    color={currentTab === index ? colors.primary : colors.neutral}
                    style={{
                      marginRight: '8px',
                    }}
                  />
                )}
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
    background: 'red',
  },
  tabBar: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: `1px solid ${colors.neutral}`,
  },
  tabButton: {
    paddingTop: '16px',
    paddingBottom: '8px',
    marginRight: spacers.default,
    borderColor: colors.neutral,
    '&:hover': {
      cursor: 'pointer',

      ...({
        '& $tabButtonText': {
          ...makeImportant({
            ...fonts.subtitle2,
          }),
        },
        '& $tabButtonIcon': {
          ...makeImportant({
            color: colors.primaryLight,
          }),
        },
      } as NestedCSSElement),
    },
  },
  tabButtonText: {},
  tabButtonIcon: {},
});
