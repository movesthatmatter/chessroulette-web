import React, { useEffect, useState } from 'react';
import { Page } from 'src/components/Page';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { getAllCuratedEvents } from '../resources';
import { CuratedEvent } from '../types';
import { AnchorLink } from 'src/components/AnchorLink';

type Props = {};

export const CuratedEventsPage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [allCuratedEvents, setAllCuratedEvents] = useState<CuratedEvent[]>([]);

  useEffect(() => {
    getAllCuratedEvents().map(setAllCuratedEvents);
  }, []);

  return (
    <Page name="Events" stretched containerClassname={cls.container}>
      {allCuratedEvents.map((event) => (
        <AnchorLink href={`/events/${event.slug}`}>{event.name}</AnchorLink>
      ))}
      {/* <ViewportList viewportRef={ref} items={items} itemMinSize={40} margin={8}>
        {(item) => (
          <div key={item.id} className="item">
            {item.title}
          </div>
        )}
      </ViewportList> */}
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
  },
}));
