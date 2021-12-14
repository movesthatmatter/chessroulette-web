import React from 'react';
import { useParams } from 'react-router-dom';
import { AuthenticatedPage } from 'src/components/Page';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { CustomTheme, hideOnMobile, onlyDesktop } from 'src/theme';
import { GamesArchive } from '../GamesArchive';
import { Menu } from './components/Menu';
import { UserDetails } from './sections/UserDetails';
import cx from 'classnames';
import { UserConnections } from './sections/UserConnections';
import { spacers } from 'src/theme/spacers';
import { keyInObject } from 'src/lib/util';

type Props = {};

type Section = {
  route: string;
  display: string;
  title: string;
};

const sectionsMap = {
  details: {
    route: 'details',
    display: 'My Details',
    title: 'My User Details',
  },
  games: {
    route: 'games',
    display: 'My Games',
    title: 'My Games Archive',
  },
  connections: {
    route: 'connections',
    display: 'My Connections',
    title: 'My Connected Apps',
  },
} as const;

const sections = Object.values(sectionsMap);

export const UserProfilePage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const params = useParams<{ section: string }>();

  // If the given section isn't correct default to 1st
  const currentSection = keyInObject(sectionsMap, params.section)
    ? (sectionsMap[params.section] as Section)
    : sections[0];

  return (
    <AuthenticatedPage
      name={`User | ${currentSection.title}`}
      render={({ user }) => (
        <div className={cx(cls.container)}>
          <Menu
            containerClassName={cx(cls.menuContainer, cls.onlyDesktop)}
            current={currentSection.route}
            sections={sections}
            activeLinkClassName={cls.activeMenuLink}
            linkClassName={cls.menuLink}
          />
          <div className={cls.sectionContainer}>
            <div className={cls.sectionTitle}>
              <h3>{currentSection.title}</h3>
            </div>
            <div>
              {params.section === 'details' && <UserDetails user={user} />}
              {params.section === 'games' && <GamesArchive userId={user.id} />}
              {params.section === 'connections' && <UserConnections user={user} />}
            </div>
          </div>
        </div>
      )}
    />
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: `calc(100% - ${spacers.defaultPx * 2}px)`,
    paddingTop: spacers.default,
    paddingBottom: spacers.default,

    ...onlyDesktop({
      paddingTop: spacers.larger,
      paddingBottom: spacers.larger,
    }),
  },
  menuContainer: {
    borderRight: `1px solid ${theme.colors.neutralLight}`,
    flex: 0.25,
    display: 'flex',
    flexDirection: 'column',
  },
  sectionContainer: {
    flex: 1,
    width: '100%',
    ...onlyDesktop({
      paddingLeft: '48px',
    }),
  },
  menuLink: {
    display: 'block',
    textDecoration: 'none',
    padding: '4px 20px 4px 0',
    marginBottom: '16px',
    color: theme.colors.neutralDarkest,

    '&:hover': {
      color: theme.colors.primary,
    },
  },
  activeMenuLink: {
    ...makeImportant({
      borderRight: `3px solid ${theme.colors.primary}`,
      color: theme.colors.primary,
      fontWeight: 'bold',
    }),
  },
  onlyDesktop: {
    ...hideOnMobile,
  },
  sectionTitle: {
    paddingTop: 0,
    margin: 0,
    lineHeight: 0,
    paddingBottom: spacers.default,
  },
}));
