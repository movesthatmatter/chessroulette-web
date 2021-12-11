import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { Page } from 'src/components/Page';
import { dedupeArray, toDictIndexedBy } from 'src/lib/util';
import { AsyncOk, AsyncResult } from 'ts-async-results';
import { getSpecifiedStreamers } from '../Live/resources';
import { Streamer } from '../Live/types';
import { EventSchedule } from './components/EventSchedule/EventSchedule';
import { getCuratedEventBySlug } from './resources';
import { CuratedEvent } from './types';

type Props = {};

export const CuratedEventRoute: React.FC<Props> = (props) => {
  const params = useParams<{ slug: string }>();
  const [state, setState] = useState<{
    event: CuratedEvent;
    streamersByUsername: Record<Streamer['username'], Streamer>;
  }>();

  useEffect(() => {
    getCuratedEventBySlug(params.slug)
      .flatMap((curatedEvent) => {
        const streamerUserNames = dedupeArray(
          curatedEvent.rounds.reduce(
            (prev, nextRound) => [...prev, ...nextRound.commentators.map((c) => c.profileUrl)],
            [] as string[]
          )
        );

        return AsyncResult.all(new AsyncOk(curatedEvent), getSpecifiedStreamers(streamerUserNames));
      })
      .map(([event, streamers]) => {
        setState({
          event,
          streamersByUsername: toDictIndexedBy(streamers.items, (s) => s.username),
        });
      });
  }, [params.slug]);

  if (!state) {
    return <AwesomeLoaderPage />;
  }

  return (
    <Page name={`Events | ${state.event?.name}`} stretched>
      {state.event && (
        <EventSchedule event={state.event} streamersByUsername={state.streamersByUsername} />
      )}
    </Page>
  );
};
