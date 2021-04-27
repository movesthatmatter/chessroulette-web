import { Resources } from 'dstnd-io';
import { http } from 'src/lib/http';

const { resource: getAllCountriesResource } = Resources.Collections.Location.GetAllCountries;
export const getAllCountries = () =>
  getAllCountriesResource.request(undefined, () => http.get('api/location/countries'));
