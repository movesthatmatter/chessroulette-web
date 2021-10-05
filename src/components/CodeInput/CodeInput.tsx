import React, { useEffect } from 'react';
import { createUseStyles, CSSProperties, makeImportant } from 'src/lib/jss';
import ReactCodeInput from 'react-verification-code-input';
import { CustomTheme, onlyMobile } from 'src/theme';
import cx from 'classnames';
import { fontFamily } from 'src/theme/text';
import { console } from 'window-or-global';

type Props = Omit<
  React.ComponentProps<typeof ReactCodeInput>, 'fieldWidth' | 'fieldHeight' | 'fields' | 'type'
> & {
  fieldsCount?: number;
  fieldSize?: number;
  inputError?: boolean;
};

export const CodeInput: React.FC<Props> = ({
  fieldsCount = 5,
  fieldSize = 60,
  className,
  ...restProps
}) => {
  const cls = useStyles();
  useEffect(() => {console.log('input erro', restProps.inputError)},[restProps.inputError])
  return (
    <div className={cx(cls.container, className)}>
      <ReactCodeInput
        type="number"
        fields={fieldsCount}
        className={cx(cls.codeInput, restProps.inputError && cls.codeInputErrorWrapper)}
        fieldWidth={fieldSize}
        fieldHeight={fieldSize}
        {...restProps}
      />
    </div>
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  container: {
    marginBottom: '16px',
  },
  codeInputErrorWrapper: {
    '&$codeInput input': {
      ...makeImportant({
        border : `1px solid ${theme.colors.negative}`
      }),
    },
  },
  codeInput: {
    ...makeImportant({
      width: '100%',
    }),
    ...{
      '& > div': {
        ...makeImportant({
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }),
      },
      
      '& input': {
        ...makeImportant({
          fontFamily: fontFamily.family,
          backgroundColor: theme.textInput.backgroundColor,
          color:theme.colors.text,
          borderRadius: '8px',
          border: theme.textInput.border
        }),

        ...onlyMobile({
          fontSize: '16px',
        }),

        '&:first-child': {
          marginLeft: '0',
        },

        '&:focus': {
          ...makeImportant({
            borderWidth: '2px',
            caretColor: theme.colors.neutral,
          }),
        }
      },
    } as CSSProperties,
  },
}));