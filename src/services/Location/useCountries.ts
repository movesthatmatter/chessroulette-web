import { Country, CountryCode } from 'dstnd-io';
import { useEffect, useState } from 'react';
import { getAllCountries } from './resources';

export const useCountries = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<Record<CountryCode, Country> | undefined>();

  return {
    countries,
    isLoading,
    fetch: () => {
      // TODO: This could be paginated later on
      setIsLoading(true);

      getAllCountries()
        .map((countries) => {
          setCountries(countries);
          setIsLoading(false);
        })
        .mapErr(() => {
          setIsLoading(false);
        });
    },
  }
};
