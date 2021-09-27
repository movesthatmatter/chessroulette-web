import React from 'react';
import { CustomTheme, darkTheme, effects, fonts, lightTheme, onlyMobile } from 'src/theme';
import Select, { Props as SelectProps } from 'react-select';
import { noop } from 'src/lib/util';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { Text } from 'src/components/Text';
import cx from 'classnames';
import { getBoxShadow } from 'src/theme/util';
import hexToRgba from 'hex-to-rgba';
import { useLightDarkMode } from 'src/theme/hooks/useLightDarkMode';

export type SelectInputOption = {
  value: string;
  label: string;
};

type Props = SelectProps & {
  className?: string;
  onSelect?: (val: SelectInputOption) => void;
};

export const SelectInput: React.FC<Props> = ({
  onSelect = noop,
  onChange = noop,
  className,
  label,
  ...props
}) => {
  const cls = useStyles();
  const {theme} = useLightDarkMode();
  const colors = {
    ...(theme === 'light' ? lightTheme.colors : darkTheme.colors)
  }
  return (
    <div className={cx(cls.container, className)}>
      {label && (
        <div className={cls.labelWrapper}>
          <Text size="small2">{label}</Text>
        </div>
      )}
      <div className={cx(cls.inputWrapper)}>
        <Select
          {...props}
          isSearchable={true}
          onChange={(value, actionType) => {
            onChange(value, actionType);

            if (actionType.action === 'select-option') {
              onSelect(value as SelectInputOption);
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
            valueContainer: (prev) => ({
              ...prev,
              paddingLeft: '11px',
              paddingRight: '11px',
            }),
            singleValue: (prev) => ({
              ...prev,
              ...fonts.small1,
            }),
            control: (prev, state) => ({
              ...prev,
              fontSize: '14px',
              minHeight: '32px',

              ...onlyMobile({
                ...makeImportant({
                  minHeight: '28px',
                }),
              }),

              ...(state.isFocused
                ? effects.floatingShadow
                : {
                    boxShadow: 'none',
                  }),

              ...(props.validationError
                ? {
                    borderColor: colors.negative,
                    boxShadow: getBoxShadow(0, 12, 26, 0, hexToRgba(colors.negative, 0.08)),
                    ':hover': {
                      borderColor: colors.negative,
                    },
                    ':active': {
                      borderColor: colors.negative,
                    },
                  }
                : {
                    borderColor: colors.neutral,
                    ':hover': {
                      borderColor: colors.neutral,
                    },
                    ':active': {
                      borderColor: colors.neutral,
                    },
                  }),
            }),
            dropdownIndicator: (prev) => ({
              ...prev,
              paddingTop: '5px',
              paddingBottom: '5px',

              ...onlyMobile({
                ...makeImportant({
                  paddingTop: '3px',
                  paddingBottom: '4px',
                }),
              }),
            }),
            indicatorSeparator: () => ({
              display: 'none',
            }),

            placeholder: () => ({
              color: lightTheme.text.disabledColor,
              fontSize: '13px',

              ...onlyMobile({
                ...makeImportant({
                  fontSize: '12px',
                  lineHeight: '16px',
                }),
              }),
            }),
          }}
        />
      </div>
      {props.validationError && (
        <div className={cls.errorMessageWrapper}>
          <Text size="small1">{props.validationError}</Text>
        </div>
      )}
    </div>
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  container: {},
  labelWrapper: {
    paddingBottom: '4px',
    paddingLeft: '12px',
  },
  inputWrapper: {},
  errorMessageWrapper: {
    color: theme.colors.negativeLight,
    paddingLeft: '12px',
  },
}));
