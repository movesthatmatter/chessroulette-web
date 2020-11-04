import { Box, Layer } from 'grommet';
import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { colors, floatingShadow, fonts, softBorderRadius } from 'src/theme';
import { Button, ButtonProps } from '../Button';
import { Text } from 'src/components/Text';
import { noop } from 'src/lib/util';
import { FormClose } from 'grommet-icons';

type Props = {
  visible: boolean;
  title?: string;
  content: string | React.ReactNode;
  graphic?: React.ReactNode;
  buttons: (ButtonProps | boolean | undefined)[];
  hasCloseButton?: boolean;
  onClose?: () => void;
};

export const Dialog: React.FC<Props> = ({ hasCloseButton = true, onClose = noop, ...props }) => {
  const cls = useStyles();

  if (!props.visible) {
    return null;
  }

  return (
    <Layer
      className={cls.container}
      position="center"
      animation="slide"
    >
        <div className={cls.top}>
          <div style={{ flex: 1 }} />
          {hasCloseButton && (
            <div onClick={() => onClose()} className={cls.exitButton}>
              <FormClose className={cls.exitIcon} />
            </div>
          )}
        </div>
        {props.graphic}
        {props.title && <div className={cls.title}>{props.title}</div>}
        <div className={cls.contentWrapper}>
          {typeof props.content === 'string' ? (
            <div className={cls.contentTextWrapper}>
              <Text className={cls.contentText}>{props.content}</Text>
            </div>
          ) : (
            <>{props.content}</>
          )}
        </div>
        <div className={cls.buttonsWrapper}>
          {props.buttons.map((buttonProps, i) => {
            if (typeof buttonProps !== 'object') {
              return null;
            }

            return (
              <Button
                key={i}
                className={cls.button}
                containerClassName={cls.buttonContainer}
                // size="medium"
                full
                {...buttonProps} 
              />
            )
          })}
        </div>
    </Layer>
  );
};

const useStyles = createUseStyles({
  container: {
    ...floatingShadow,
    ...softBorderRadius,
    borderRadius: '8px !important',
    minWidth: '200px !important',
    maxWidth: '360px !important',
    width: '50% !important',
    padding: 0,
    paddingBottom: '24px !important',
    position: 'relative',
  },
  top: {
    height: '32px',
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: '4px',
    paddingRight: '4px',
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
  },
  contentWrapper: {
    paddingBottom: '32px',
    paddingLeft: '32px',
    paddingRight: '32px',
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
  },
  buttonContainer: {
    marginLeft: '16px',

    '&:first-child': {
      marginLeft: 0,
    },
  },
  button: {
    
    paddingBottom: 0,
    marginBottom: 0,
  },
});
