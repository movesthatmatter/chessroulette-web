import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { TextInput } from '../TextInput';

type Props = {
  onSearch: (s: string) => void;
};

export const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const cls = useStyles();
  const [searchValue, setSearchValue] = useState('');
  useEffect(() => {
    if (searchValue !== '') {
      onSearch(searchValue);
    }
  }, [searchValue]);
  return (
    <div className={cls.container}>
      <TextInput
        placeholder="Search"
        defaultValue={searchValue}
        onChange={(e) => {
          setSearchValue(e.currentTarget.value);
        }}
      />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
});
