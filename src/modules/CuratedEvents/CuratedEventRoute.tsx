import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AwesomeLoader, AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { Page } from 'src/components/Page';
import { createUseStyles } from 'src/lib/jss';
import { EventSchedule } from './components/EventSchedule/EventSchedule';
import { getCuratedEventBySlug } from './resources';
import { CuratedEvent } from './types';

type Props = {};

export const CuratedEventRoute: React.FC<Props> = (props) => {
  const cls = useStyles();
  const params = useParams<{ slug: string }>();
  const [event, setEvent] = useState<CuratedEvent>();

  useEffect(() => {
    getCuratedEventBySlug(params.slug).map((curatedEvent) => {
      setEvent(curatedEvent);
    });
  }, [params.slug]);

  if (!event) {
    return <AwesomeLoaderPage />;
  }

  return (
    <Page name={`Events | ${event?.name}`} stretched>
      {event && <EventSchedule event={event} />}
    </Page>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    // display: 'flex',
    // justifyContent: 'center',
    // margin: '0 auto',
  },
  // verticalSpacer: {
  //   height: spacers.large,
  // },
  // pageContainer: {
  //   ...makeImportant({
  //     ...(theme.name === 'lightDefault'
  //       ? {
  //           backgroundColor: theme.colors.background,
  //         }
  //       : {
  //           backgroundColor: '#27104e',
  //           backgroundImage: 'linear-gradient(19deg, #27104e 0%, #161a2b 25%)',
  //         }),
  //   }),
  // },
}));
