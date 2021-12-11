import { Resources } from 'dstnd-io';
import { http } from 'src/lib/http';

const {
  resource: createCuratedEventsResource,
} = Resources.Collections.CuratedEvents.CreateCuratedEvent;

export const createCuratedEvent = (
  req: Resources.Util.RequestOf<typeof createCuratedEventsResource>
) => {
  return createCuratedEventsResource.request(req, (data) => http.post('api/curated-events', data));
};

const {
  resource: getAllCuratedEventsResource,
} = Resources.Collections.CuratedEvents.GetAllCuratedEvents;

export const getAllCuratedEvents = (
  req: Resources.Util.RequestOf<typeof getAllCuratedEventsResource>
) => {
  return getAllCuratedEventsResource.request(req, () => http.get('api/curated-events'));
};

const {
  resource: createCuratedEventRoundResource,
} = Resources.Collections.CuratedEvents.CreateCuratedEventRound;

export const createCuratedEventRound = (
  req: Resources.Util.RequestOf<typeof createCuratedEventRoundResource>
) => {
  return createCuratedEventRoundResource.request(req, (data) =>
    http.put(`api/curated-events/rounds/${req.curatedEventId}`, data)
  );
};

const {
  resource: getStreamersResource,
} = Resources.Collections.Collaborator.GetCollaboratorsByPlatform;

export const getCollaboratorStreamers = (
  req: Resources.Util.RequestOf<typeof getStreamersResource>
) => {
  return getStreamersResource.request(req, (params) => http.get('api/collaborators', { params }));
};

const { resource: deleteEventResource } = Resources.Collections.CuratedEvents.DeleteCuratedEvent;

export const deleteCuratedEvent = (req: Resources.Util.RequestOf<typeof deleteEventResource>) => {
  return deleteEventResource.request(req, (params) =>
    http.post(`api/curated-events/delete/${req.id}`, params)
  );
};

const {resource: deleteRoundResource} = Resources.Collections.CuratedEvents.DeleteCuratedEventRound;

export const deleteCuratedEventRound = (req: Resources.Util.RequestOf<typeof deleteRoundResource>) => {
  return deleteRoundResource.request(req, (params) =>
    http.post(`api/curated-events/rounds/delete/${req.roundId}`, params)
  );
};
