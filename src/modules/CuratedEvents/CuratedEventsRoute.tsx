import React, { useEffect, useState } from 'react';
import { Page } from 'src/components/Page';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { EventSchedule } from './components/EventSchedule/EventSchedule';
import { CuratedEventsPage } from './pages/CuratedEventsPage';
import { getAllCuratedEvents, getCuratedEventBySlug } from './resources';
import { CuratedEvent } from './types';

type Props = {};

export const CuratedEventsRoute: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [event, setEvent] = useState<CuratedEvent>();

  useEffect(() => {
    getCuratedEventBySlug('wcc-2021').map((curatedEvent) => {
      setEvent(curatedEvent);
    });
  }, []);

  return <CuratedEventsPage />

  // return (
  //   <Page name="Events" stretched containerClassname={cls.pageContainer}>
  //     {/* <div className={cls.container}> */}
  //       {/* <WccCalendar /> */}
  //       {/* {event && <EventSchedule event={event} />} */}
  //     {/* </div> */}
  //   </Page>
  // );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    display: 'flex',
    // justifyContent: 'center',
    // margin: '0 auto',
  },
  verticalSpacer: {
    height: spacers.large,
  },
  pageContainer: {
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
