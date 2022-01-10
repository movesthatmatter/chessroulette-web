import React, { useEffect, useState } from 'react';
import { Page } from 'src/components/Page';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { getAllCuratedEvents } from '../resources';
import { CuratedEvent } from '../types';
import { AnchorLink } from 'src/components/AnchorLink';
import eventsSplash from './assets/events_splash.svg';
import { EventItem } from './components/EventItem';

type Props = {};

export const CuratedEventsPage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [allCuratedEvents, setAllCuratedEvents] = useState<CuratedEvent[]>([]);

  useEffect(() => {
    getAllCuratedEvents({}).map(setAllCuratedEvents);
  }, []);

  return (
    <Page
      name="Events"
      title="Events"
      stretched
      contentClassName={cls.content}
      containerClassname={cls.container}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          flexDirection: 'column',
          zIndex: 9,
          position:'relative'
        }}
      >
        {allCuratedEvents.map((event) => (
          <EventItem event={event} />
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          bottom: '3em',
          width: '100vw',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        <img src={eventsSplash} />
      </div>
    </Page>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    ...makeImportant({
      ...(theme.name === 'lightDefault'
        ? {
            backgroundColor: theme.colors.background,
          }
        : {
            backgroundColor: '#27104e',
            backgroundImage: 'linear-gradient(19deg, #27104e 0%, #161a2b 25%)',
          }),
    }),
    position: 'relative',
  },
  content: {
    display: 'flex',
  },
}));
