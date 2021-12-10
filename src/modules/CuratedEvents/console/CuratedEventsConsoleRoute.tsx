import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'src/components/Button';
import { ConfirmButton } from 'src/components/Button/ConfirmButton';
import { WithDialog } from 'src/components/Dialog';
import { Page } from 'src/components/Page';
import { spacers } from 'src/theme/spacers';
import { AsyncResult } from 'ts-async-results';
import { console } from 'window-or-global';
import {
  createCuratedEvent,
  getAllCuratedEvents,
  createCuratedEventRound,
  getCollaboratorStreamers,
  deleteCuratedEvent,
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
    getAllCuratedEvents({ byProp: 'type', value: 'externalTournament' }).map(setCuratedEvents);
  }, []);

  const getAllStreamers = useCallback(() => {
    getCollaboratorStreamers({
      platform: 'Twitch',
      pageSize: 50,
      currentIndex: 0,
    }).map(({ items }) => setCollaborators(items.map((i) => i.profileUrl)));
  }, []);

  const deleteEvent = (id: string) => {
    deleteCuratedEvent({ id }).map((res) => {
      if (res.success) {
        getAllCuratedEventsAndPopulateThem();
      }
      //TODO - add some UI feedback, maybe a Dialog to inform of the failure
      console.log('COULD NOT DELETE event!');
    });
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

      <div
        style={{
          display: 'flex',
          width: '100vw',
          overflowX: 'scroll',
        }}
      >
        {curatedEvents.map((ce) => (
          <div
            key={ce.id}
            style={{
              marginBottom: spacers.large,
              paddingLeft: spacers.default,
              borderLeft: '2px solid #CE186B',
              marginRight: spacers.large,
            }}
          >
            <EventViewer event={ce} />
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
                  <ConfirmButton
                    onConfirmed={() => deleteEvent(ce.id)}
                    buttonProps={{
                      label: 'Delete Event',
                      type: 'negative',
                    }}
                    dialogProps={{
                      title: 'Delete Event?',
                      content: 'Are you sure you want to delete this event and all its rounds?',
                      buttonsStacked: false,
                    }}
                    cancelButtonProps={{
                      label: 'Cancel',
                      type: 'secondary',
                    }}
                    confirmButtonProps={{
                      label: 'Yes',
                      type: 'negative',
                    }}
                  />
                </div>
              )}
            />
          </div>
        ))}
      </div>
    </Page>
  );
};
