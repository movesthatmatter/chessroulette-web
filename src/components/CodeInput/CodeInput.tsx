import React from 'react';
import { createUseStyles, makeImportant, NestedCSSElement } from 'src/lib/jss';
import ReactCodeInput from 'react-verification-code-input';
import { onlyMobile } from 'src/theme';
import cx from 'classnames';

type Props = Omit<
  React.ComponentProps<typeof ReactCodeInput>,
  'fieldWidth' | 'fieldHeight' | 'fields' | 'type'
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

const useStyles = createUseStyles((theme) => ({
  container: {
    marginBottom: '16px',
  },
  codeInputErrorWrapper: {
    ...({
      '&$codeInput input': {
        ...makeImportant({
          border: `1px solid ${theme.colors.negative}`,
        }),
      },
    } as NestedCSSElement),
  },
  codeInput: {
    ...makeImportant({
      width: '100%',
    }),
    ...({
      '& > div': {
        ...makeImportant({
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }),
      },

      '& input': {
        ...makeImportant({
          fontFamily: theme.text.family,
          backgroundColor: theme.textInput.backgroundColor,
          color: theme.text.baseColor,
          borderRadius: '8px',
          border: theme.textInput.border,
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
        },
      },
    } as NestedCSSElement),
  },
}));
