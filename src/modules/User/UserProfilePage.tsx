import React from 'react';
import { useParams } from 'react-router-dom';
import { AuthenticatedPage } from 'src/components/Page';
import { createUseStyles } from 'src/lib/jss';
import { colors, text } from 'src/theme';
import { GamesArchive } from '../GamesArchive/GamesArchive';
import { Menu } from './components/Menu';
import { UserDetails } from './sections/UserDetails';

type Props = {};

const sections = [
  {
    route: 'profile',
    display: 'My Profile',
  },
  { 
    route: 'games',
    display: 'My Games',
  },
];

export const UserProfilePage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const params = useParams<{ section: string }>();

  return (
    <AuthenticatedPage
      render={({ user }) => (
        <div className={cls.container}>
          <Menu
            containerClassName={cls.menuContainer}
            current={params.section}
            sections={sections}
            activeLinkClassName={cls.activeMenuLink}
            linkClassName={cls.menuLink}
          />
          <div className={cls.sectionContainer}>
            {params.section === 'profile' && (
              <UserDetails user={user} />
            )}
            {params.section === 'games' && (
              <GamesArchive user={user} />
            )}
          </div>
        </div>
      )}
    />
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: 'calc(100% - 120px)',
    paddingTop: '60px',
    paddingBottom: '60px',
  },
  menuContainer: {
    borderRight: `1px solid ${colors.neutral}`,
    flex: 0.25,
    display: 'flex',
    flexDirection: 'column',
  },
  sectionContainer: {
    flex: 1,
    paddingLeft: '48px',
  },
  menuLink: {
    display: 'block',
    textDecoration: 'none',
    padding: '4px 20px 4px 0',
    marginBottom: '16px',
    color: colors.neutralDarkest,

    '&:hover': {
      borderRight: `3px solid ${text.primaryColor}`,
      color: text.primaryColor,
      fontWeight: 'bold',
    },
  },
  activeMenuLink: {
    borderRight: `3px solid ${text.primaryColor}`,
    color: text.primaryColor,
    fontWeight: 'bold',
  }
});
