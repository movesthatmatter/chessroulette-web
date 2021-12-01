import { Resources } from 'dstnd-io';
import { http } from 'src/lib/http';

const { resource: createAnalysisResource } = Resources.Collections.Analysis.CreateAnalysis;

export const createAnalysis = (req: Resources.Util.RequestOf<typeof createAnalysisResource>) => {
  return createAnalysisResource.request(req, (body) => http.post(`api/analyses`, body));
};

const { resource: getAnalysisResource } = Resources.Collections.Analysis.GetAnalysis;

export const getAnalysis = (req: Resources.Util.RequestOf<typeof getAnalysisResource>) => {
  return getAnalysisResource.request(req, (params) => http.get(`api/analyses/${params.id}`));
};
