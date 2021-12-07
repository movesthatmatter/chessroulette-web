import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'src/components/Button';
import { WithDialog } from 'src/components/Dialog';
import { Page } from 'src/components/Page';
import { createUseStyles } from 'src/lib/jss';
import { noop } from 'src/lib/util';
import { spacers } from 'src/theme/spacers';
import { AsyncResult } from 'ts-async-results';
import { console } from 'window-or-global';
import { createCuratedEvent, getAllCuratedEvents, createCuratedEventRound } from '../resources';
import { CuratedEvent } from '../types';
import { CreateCuratedEventForm } from './components/CreateCuratedEventForm';
import { CreateCuratedEventRoundForm } from './components/CreateCuratedEventRoundForm';

type Props = {};

export const CuratedEventsConsoleRoute: React.FC<Props> = (props) => {
  const cls = useStyles();

  const [curatedEvents, setCuratedEvents] = useState<CuratedEvent[]>([]);

  useEffect(() => {
    getAllCuratedEventsAndPopulateThem();
  }, []);

  const getAllCuratedEventsAndPopulateThem = useCallback(() => {
    getAllCuratedEvents().map(setCuratedEvents);
  }, []);

  const deleteEvent = () => {
    //TODO - add delete event resource and api call
  }

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

      <div>
        {curatedEvents.map((ce) => (
          <div key={ce.id}>
            <pre>{JSON.stringify(ce, null, 2)}</pre>
            <WithDialog
              hasCloseButton
              content={(d) => (
                <CreateCuratedEventRoundForm
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
                    // .map((res) => {
                    //   console.log('res', res);
                    //   // getAllCuratedEventsAndPopulateThem();
                    // })
                    // .map(d.onClose)
                    // .mapErr(d.onClose);
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

const useStyles = createUseStyles({
  container: {},
});
