import React from 'react';
import { colors, fonts } from 'src/theme';
import Select, { Props as SelectProps }  from 'react-select';
import { noop } from 'src/lib/util';

type Option = {
  value: string;
  label: string;
}

type Props = SelectProps & {
  onSelect?: (val: Option) => void;
};

export const SelectInput: React.FC<Props> = ({
  onSelect = noop,
  onChange = noop,
  ...props
}) => {
  return (
    <Select
      {...props}
      isSearchable={false}
      onChange={(value, actionType) => {
        onChange(value, actionType);

        if (actionType.action === 'select-option') {
          onSelect(value as Option);
        }
      }}
      theme={(theme) => ({
        ...theme,
        borderRadius: 16,
        overflow: 'hidden',
        colors: {
          ...theme.colors,
          primary: colors.primary,
          danger: colors.negative,
          neutral: colors.neutral,
        },
      })}
      styles={{
        menu: (prev) => ({
          ...prev,
          overflow: 'hidden',
          padding: 0,
        }),
        option: (prev) => ({
          ...prev,
          '&:first-of-type': {
            marginTop: '-4px',
          },
          '&:last-of-type': {
            marginBottom: '-4px',
          },
          fontSize: '14px',
        }),
        singleValue: (prev) => ({
          ...prev,
          ...fonts.small1,
          fontWeight: 600,
        }),
        control: (prev) => ({
          ...prev,
          fontSize: '14px',
          minHeight: '32px',
        }),
        dropdownIndicator: (prev) => ({
          ...prev,
          paddingTop: '5px',
          paddingBottom: '5px',
        }),
        indicatorSeparator: () => ({
          display: 'none',
        })
      }}
    />
  );
};
