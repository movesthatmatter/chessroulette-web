import { Country, CountryCode } from 'chessroulette-io';
import React from 'react';
import { useCountries } from './useCountries';

type Props = {
  render: (p: {
    countries: Record<CountryCode, Country> | undefined;
    countriesForDisplay : Country[];
    isLoading: boolean;
    fetch: () => void;
  }) => void;
};

export const GetCountries: React.FC<Props> = (props) => {
  const state = useCountries();

  return <>{props.render(state)}</>;
};
