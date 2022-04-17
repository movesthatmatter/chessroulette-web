import { Country, CountryCode } from 'chessroulette-io';
import { useEffect, useState } from 'react';
import { getAllCountries } from './resources';

export const useCountries = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<Record<CountryCode, Country> | undefined>();
  const [countriesForDisplay, setCountriesForDispaly] = useState<Country[]>([]);
  return {
    countries,
    countriesForDisplay,
    isLoading,
    fetch: () => {
      // TODO: This could be paginated later on
      setIsLoading(true);
      getAllCountries()
        .map((countries) => {
          setCountries(countries);
          setCountriesForDispaly(Object.values(countries).sort((a, b) => a.name.localeCompare(b.name)))
          setIsLoading(false);
        })
        .mapErr(() => {
          setIsLoading(false);
        });
    },
  }
};
