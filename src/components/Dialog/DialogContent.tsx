import React from 'react';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { colors, floatingShadow, fonts, onlyMobile, softBorderRadius } from 'src/theme';
import { Button, ButtonProps } from '../Button';
import { Text } from 'src/components/Text';
import { hasOwnProperty, noop } from 'src/lib/util';
import { FormClose } from 'grommet-icons';
import cx from 'classnames';

type DangerouslySetInnerHTML = { __html: string };

export type DialogContentProps = {
  title?: string;
  content: string | DangerouslySetInnerHTML | React.ReactNode;
  graphic?: React.ReactNode;
  buttons?: (ButtonProps | boolean | undefined)[];
  buttonsStacked?: boolean;
  hasCloseButton?: boolean;
  onClose?: () => void;
  className?: string;
  contentContainerClass?: string;
};

const isDangerouslySetHtml = (t: unknown): t is DangerouslySetInnerHTML =>
  typeof t === 'object' && hasOwnProperty(t || {}, '__html');

export const DialogContent: React.FC<DialogContentProps> = ({
  hasCloseButton = true,
  onClose = noop,
  contentContainerClass,
  className,
  ...props
}) => {
  const cls = useStyles();

  return (
    <div className={className}>
      <div className={cls.top}>
        <div style={{ flex: 1 }} />
        {hasCloseButton && (
          <div onClick={() => onClose()} className={cls.exitButton}>
            <FormClose className={cls.exitIcon} />
          </div>
        )}
      </div>
      {props.title && <div className={cls.title}>{props.title}</div>}
      {props.graphic}
      <div className={cx(cls.contentWrapper, contentContainerClass)}>
        {typeof props.content === 'string' || isDangerouslySetHtml(props.content) ? (
          <div className={cls.contentTextWrapper}>
            {typeof props.content === 'string' ? (
              <Text className={cls.contentText}>{props.content}</Text>
            ) : (
              <Text className={cls.contentText} dangerouslySetInnerHTML={props.content} />
            )}
          </div>
        ) : (
          props.content
        )}
      </div>
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
                full
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
    ...floatingShadow,
    ...softBorderRadius,
    padding: 0,
    position: 'relative',

    ...makeImportant({
      borderRadius: '8px',
      minWidth: '200px',
      maxWidth: '360px',
      width: '50%',
    }),

    ...onlyMobile({
      ...makeImportant({
        width: '84%',
        maxWidth: 'none',
      }),
    }),
  },
  top: {
    height: '32px',
    marginBottom: '-8px',
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: '4px',
    paddingRight: '4px',

    ...onlyMobile({
      ...makeImportant({
        marginBottom: '-16px',
      }),
    }),
  },
  exitButton: {
    display: 'flex',
    cursor: 'pointer',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  exitIcon: {
    fill: `${colors.neutralDark} !important`,
    stroke: `${colors.neutralDark} !important`,
  },
  title: {
    ...fonts.subtitle1,
    textAlign: 'center',
    paddingLeft: '32px',
    paddingRight: '32px',
    paddingBottom: '16px',

    ...onlyMobile({
      ...makeImportant({
        paddingLeft: '18px',
        paddingRight: '18px',
        paddingBottom: '12px',
      }),
    }),
  },
  contentWrapper: {
    paddingLeft: '32px',
    paddingRight: '32px',
    paddingBottom: '32px',

    ...onlyMobile({
      paddingLeft: '18px',
      paddingRight: '18px',
      paddingBottom: '18px',
    }),
  },
  contentTextWrapper: {
    textAlign: 'center',
  },
  contentText: {
    ...fonts.body2,
  },
  buttonsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: '32px',
    paddingRight: '32px',
    paddingBottom: '24px',

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
