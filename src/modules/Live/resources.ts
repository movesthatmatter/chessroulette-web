import { Resources } from 'dstnd-io';
import { http } from 'src/lib/http';

const {
  resource: getCollaboratorsByPlatformResource,
} = Resources.Collections.Collaborator.GetCollaboratorsByPlatform;

export const getCollaboratorsByPlatform = (
  req: Resources.Util.RequestOf<typeof getCollaboratorsByPlatformResource>
) => {
  return getCollaboratorsByPlatformResource.request(req, (params) =>
    http.get(`api/collaborators`, { params })
  );
};

const { resource: getLiveStreamersResource } = Resources.Collections.Watch.GetLiveStreamers;

// TODO: The resource for this needs to change to featured
export const getFeaturedStreamers = (
  req: Resources.Util.RequestOf<typeof getLiveStreamersResource>
) => {
  return getLiveStreamersResource.request(req, (params) =>
    http.get(`api/watch/featured`, { params })
  );
};

const { resource: getStreamersResource } = Resources.Collections.Watch.GetStreamers;

export const getCollaboratorStreamers = (
  req: Resources.Util.RequestOf<typeof getStreamersResource>
) => {
  return getStreamersResource.request(req, (params) =>
    http.get('api/watch/collaborators', { params })
  );
};
