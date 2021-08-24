import React from 'react';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { fonts, onlyMobile } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { Button } from '../Button';
import { DialogContent, DialogContentProps } from '../Dialog/DialogContent';

type Props = Pick<DialogContentProps, 'buttons' | 'buttonsStacked' | 'graphic' | 'title'> & {
  // onHandleStep: () => void;
};

export const DialogWizardStep: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      {props.title && <div className={cls.title}>{props.title}</div>}
      {props.graphic && <div className={cls.graphicContainer}>{props.graphic}</div>}
      <div className={cls.content}>{props.children}</div>
      {props.buttons && (
        <div
          className={cls.buttonsWrapper}
          {...(props.buttonsStacked && {
            style: {
              flexDirection: 'column',
            },
          })}
        >
          {props.buttons.map((buttonProps, i) => {
            if (typeof buttonProps !== 'object') {
              return null;
            }

            return (
              <Button
                key={i}
                className={cls.button}
                containerClassName={
                  props.buttonsStacked ? cls.stackedButtonContainer : cls.buttonContainer
                }
                // size="medium"
                // full
                {...buttonProps}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  title: {
    ...fonts.subtitle1,
    textAlign: 'center',
    paddingBottom: spacers.default,

    ...onlyMobile({
      ...makeImportant({
        paddingLeft: '18px',
        paddingRight: '18px',
        paddingBottom: '12px',
      }),
    }),
  },
  graphicContainer: {
    width: '50%',
    maxWidth: '300px',
    margin: '0 auto',
    paddingBottom: spacers.small,
  },
  content: {},
  buttonsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: spacers.larger,
    paddingBottom: spacers.large,

    '&:last-child': {
      paddingBottom: 0,
    },

    ...onlyMobile({
      paddingLeft: '18px',
      paddingRight: '18px',
      paddingBottom: '16px',
    }),
  },
  buttonContainer: {
    marginLeft: '16px',

    '&:first-child': {
      marginLeft: 0,
    },
  },
  stackedButtonContainer: {
    marginBottom: '16px',

    '&:last-child': {
      marginBottom: 0,
    },
  },
  button: {
    ...makeImportant({
      paddingBottom: 0,
      marginBottom: 0,
    }),
  },
});
