import React from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles, makeImportant, NestedCSSElement } from 'src/lib/jss';
import { colors, fonts, text } from 'src/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { spacers } from 'src/theme/spacers';
import { noop } from 'src/lib/util';

type TabProps = {
  title: string;
  icon: IconProp;
  content: string | React.ReactNode;
};

type TabsProps = {
  tabs: TabProps[];
  currentTabIndex: number;
  onTabChanged: (nextIndex: number) => void;
};

export const Tabs: React.FC<TabsProps> = ({ tabs, onTabChanged = noop, currentTabIndex = 0 }) => {
  const cls = useStyles();

  return (
    <>
      <div className={cls.tabBar}>
        {tabs.map((tab, index) => (
          <div
            className={cls.tabButton}
            onClick={() => {
              onTabChanged(index);
            }}
          >
            <Text
              size="subtitle2"
              className={cls.tabButtonText}
              style={
                currentTabIndex !== index
                  ? {
                      color: colors.neutralDarker,
                    }
                  : {
                      color: text.baseColor,
                    }
              }
            >
              {tab.icon && (
                <FontAwesomeIcon
                  icon={tab.icon}
                  className={cls.tabButtonIcon}
                  size="lg"
                  color={currentTabIndex === index ? colors.primary : colors.neutral}
                />
              )}
              {tab.title}
            </Text>
          </div>
        ))}
      </div>
      {tabs[currentTabIndex].content}
    </>
  );
};

const useStyles = createUseStyles({
  tabBar: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: `1px solid ${colors.neutral}`,
  },
  iconWrapper: {
    marginRight: spacers.small,
  },
  tabButton: {
    paddingTop: spacers.default,
    paddingBottom: spacers.default,
    marginRight: spacers.default,
    borderColor: colors.neutral,
    '&:hover': {
      cursor: 'pointer',

      ...({
        '& $tabButtonText': {
          ...makeImportant({
            ...fonts.subtitle2,
            color: text.baseColor,
          }),
        },
        '& $tabButtonIcon': {
          ...makeImportant({
            color: colors.primary,
          }),
        },
      } as NestedCSSElement),
    },
  },
  tabButtonText: {},
  tabButtonIcon: {
    marginRight: spacers.small,
  },
});
