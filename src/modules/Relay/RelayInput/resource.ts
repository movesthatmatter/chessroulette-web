import { Resources } from 'dstnd-io';
import { RequestOf } from 'dstnd-io/dist/sdk/resource';
import { http } from 'src/lib/http';

const { resource: createRelayResource } = Resources.Collections.Relay.CreateRelay;

export const createRelay = (req: RequestOf<typeof createRelayResource>) => {
  return createRelayResource.request(req, (body) => {
    return http.post('api/relays', body)
  });
};
