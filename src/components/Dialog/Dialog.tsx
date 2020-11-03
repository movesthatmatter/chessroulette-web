import { Box, Layer, Text } from 'grommet';
import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { colors, floatingShadow, fonts, softBorderRadius } from 'src/theme';
import { Button, ButtonProps } from '../Button';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { noop } from 'src/lib/util';
import { FormClose } from 'grommet-icons';

type Props = {
  visible: boolean;
  title?: string;
  content: string | React.ReactNode;
  graphic?: React.ReactNode;
  buttons: ButtonProps[];
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
          {props.buttons.map((buttonProps) => (
            <Button 
              className={cls.button}
              containerClassName={cls.buttonContainer}
              {...buttonProps} 
            />
          ))}
        </div>
    </Layer>
  );
};

const useStyles = createUseStyles({
  container: {
    ...floatingShadow,
    ...softBorderRadius,
    minWidth: '200px',
    maxWidth: '400px',
    width: '50%',
    paddingBottom: '16px',
    position: 'relative',
  },
  top: {
    height: '32px',
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  exitButton: {
    cursor: 'pointer',
    justifySelf: 'flex-end',
    alignSelf: 'flex-end',
  },
  exitIcon: {
    color: 'red',
    fill: colors.neutralDark,
    stroke: colors.neutralDark,
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
