import React from 'react';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { CustomTheme, floatingShadow, fonts, onlyMobile, softBorderRadius } from 'src/theme';
import { Button, ButtonProps } from '../Button';
import { Text } from 'src/components/Text';
import { hasOwnProperty, noop } from 'src/lib/util';
import { FormClose } from 'grommet-icons';
import cx from 'classnames';
import { spacers } from 'src/theme/spacers';

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
  buttonsContainerClass?: string;
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
          className={cx(cls.buttonsWrapper, props.buttonsContainerClass)}
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

const useStyles = createUseStyles(theme => ({
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
    fill: `${theme.colors.neutralDark} !important`,
    stroke: `${theme.colors.neutralDark} !important`,
  },
  title: {
    ...fonts.subtitle1,
    color:theme.text.baseColor,
    textAlign: 'center',
    paddingLeft: spacers.large,
    paddingRight: spacers.large,
    paddingBottom: spacers.default,

    ...onlyMobile(
      {
        ...makeImportant({
          paddingLeft: '18px',
          paddingRight: '18px',
          paddingBottom: '12px',
        }),
      },
      fonts.subtitle1
    ),
  },
  contentWrapper: {
    paddingLeft: spacers.large,
    paddingRight: spacers.large,
    paddingBottom: spacers.default,
    color: theme.text.baseColor,
    ...onlyMobile({
      paddingLeft: '18px',
      paddingRight: '18px',
      paddingBottom: '12px',
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
    paddingLeft: spacers.large,
    paddingRight: spacers.large,
    paddingBottom: spacers.default,
    paddingTop: spacers.default,

    ...onlyMobile({
      paddingLeft: spacers.default,
      paddingRight: spacers.default,
      paddingBottom: spacers.default,
    }),
  },
  buttonContainer: {
    marginLeft: spacers.default,

    ...onlyMobile({
      marginLeft: spacers.small,
    }),

    '&:first-child': {
      marginLeft: 0,
    },
  },
  stackedButtonContainer: {
    marginBottom: spacers.default,

    ...onlyMobile({
      marginBottom: spacers.small,
    }),

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
}));
