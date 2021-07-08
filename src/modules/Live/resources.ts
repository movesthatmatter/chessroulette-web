import { Resources } from 'dstnd-io';
import { http } from 'src/lib/http';

const { resource: getCollaboratorsByPlatformResource } = Resources.Collections.Collaborator.GetCollaboratorsByPlatform;

export const getCollaboratorsByPlatform = (req: Resources.Util.RequestOf<typeof getCollaboratorsByPlatformResource>) => {
  return getCollaboratorsByPlatformResource.request(req, (params) => http.get(`api/collaborators`, { params }));
};
