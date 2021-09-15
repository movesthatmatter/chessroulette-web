import React, { useContext } from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { colors, text } from 'src/theme';
import { RoomProviderContext } from '../RoomProvider';
import { usePeerState } from 'src/providers/PeerProvider';
import { RoomActivityType } from 'dstnd-io';

type Props = {
  type: RoomActivityType;
  text: string;
  className?: string;
};

export const SwitchActivityRoomConsumer: React.FC<Props> = (props) => {
  const cls = useStyles();
  const context = useContext(RoomProviderContext);

  if (!context) {
    return null;
  }

  return (
    <div className={cx(cls.container, props.className)}>
      <a
        className={cls.link}
        onClick={() => {
          // context.roomActions.switchActivity(props.type);
        }}
      >
        {props.text}
      </a>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    // textAlign: 'center',
    // paddingLeft: '20px',
    // paddingRight: '20px',
    // alignSelf: 'center',
    // position: 'relative',
  },
  link: {
    textTransform: 'capitalize',
    textDecoration: 'none',
    color: colors.neutralDarkest,
    fontFamily: 'Lato, Open Sans, sans serif',
    fontSize: '16px',
    textAlign: 'center',

    '&:hover': {
      borderBottom: `3px solid ${text.primaryColor}`,
      color: text.primaryColor,
    },
  },
});
