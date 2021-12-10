import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'src/components/Button';
import { WithDialog } from 'src/components/Dialog';
import { Page } from 'src/components/Page';
import { createUseStyles } from 'src/lib/jss';
import { noop } from 'src/lib/util';
import { spacers } from 'src/theme/spacers';
import { AsyncResult } from 'ts-async-results';
import { console } from 'window-or-global';
import {
  createCuratedEvent,
  getAllCuratedEvents,
  createCuratedEventRound,
  getCollaboratorStreamers,
} from '../resources';
import { CuratedEvent } from '../types';
import { CreateCuratedEventForm } from './components/CreateCuratedEventForm';
import { CreateCuratedEventRoundForm } from './components/CreateCuratedEventRoundForm';
import { EventViewer } from './components/EventViewer';

type Props = {};

export const CuratedEventsConsoleRoute: React.FC<Props> = (props) => {

  const [curatedEvents, setCuratedEvents] = useState<CuratedEvent[]>([]);
  const [collaborators, setCollaborators] = useState<string[]>([]);

  useEffect(() => {
    getAllCuratedEventsAndPopulateThem();
    getAllStreamers();
  }, []);

  const getAllCuratedEventsAndPopulateThem = useCallback(() => {
    getAllCuratedEvents().map(setCuratedEvents)
  }, []);

  const getAllStreamers = useCallback(() => {
    getCollaboratorStreamers({
      platform: 'Twitch',
      pageSize: 50,
      currentIndex: 0,
    }).map(({ items }) => setCollaborators(items.map((i) => i.profileUrl)));
  }, []);

  const deleteEvent = () => {
    //TODO - add delete event resource and api call
  };

  return (
    <Page name="Console | Curated Events" stretched>
      <WithDialog
        hasCloseButton
        content={(d) => (
          <CreateCuratedEventForm
            onSubmit={(r) => {
              return createCuratedEvent(r)
                .map(() => {
                  getAllCuratedEventsAndPopulateThem();
                })
                .map(AsyncResult.passThrough(d.onClose))
                .mapErr(AsyncResult.passThrough(d.onClose));
            }}
          />
        )}
        buttons={[]}
        render={(p) => <Button label="New Event" onClick={p.onOpen} />}
      />
      <br />

      <div style={{
        display:'flex',
        width: '100vw',
        overflowX: 'scroll'
      }}>
        {curatedEvents.map((ce) => (
          <div key={ce.id} style={{marginBottom: spacers.large, paddingLeft: spacers.default,  borderLeft: '2px solid #CE186B', marginRight: spacers.large}}>
            <EventViewer event={ce}/>
            <WithDialog
              hasCloseButton
              content={(d) => (
                <CreateCuratedEventRoundForm
                  collaborators={collaborators}
                  onSubmit={(r) => {
                    return createCuratedEventRound({
                      curatedEventId: ce.id,
                      ...r,
                    })
                      .map((res) => {
                        getAllCuratedEventsAndPopulateThem();
                      })
                      .map(AsyncResult.passThrough(d.onClose))
                      .mapErr(AsyncResult.passThrough(d.onClose));
                  }}
                />
              )}
              render={(p) => (
                <div style={{ display: 'flex' }}>
                  <Button label="Add Round" type="positive" onClick={p.onOpen} />
                  <div style={{ width: spacers.default }} />
                  <Button label="Delete Event" type="negative" onClick={noop} disabled />
                </div>
              )}
            />
          </div>
        ))}
      </div>
    </Page>
  );
};

