import React from 'react';
import { createUseStyles, CSSProperties, makeImportant } from 'src/lib/jss';
import ReactCodeInput from 'react-verification-code-input';
import { CustomTheme, onlyMobile } from 'src/theme';
import cx from 'classnames';
import { fontFamily } from 'src/theme/text';

type Props = Omit<
  React.ComponentProps<typeof ReactCodeInput>, 'fieldWidth' | 'fieldHeight' | 'fields' | 'type'
> & {
  fieldsCount?: number;
  fieldSize?: number;
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
        className={cls.codeInput}
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

          borderRadius: '8px',
          border: `1px solid ${theme.colors.neutral}`,
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