import React from 'react';
import { UserRecord } from 'chessroulette-io';
import { createUseStyles } from 'src/lib/jss';
import { CustomTheme, fonts } from 'src/theme';
import cx from 'classnames';
import { spacers } from 'src/theme/spacers';
import { InfoNotification } from '../../types';
import { hasOwnProperty } from 'src/lib/util';
import { DangerouslySetInnerHTML } from '../../types';
import { Text } from 'src/components/Text';

type Props = {
  notification: InfoNotification;
  className?: string;
  me: UserRecord;
};

const isDangerouslySetHtml = (t: unknown): t is DangerouslySetInnerHTML =>
  typeof t === 'object' && hasOwnProperty(t || {}, '__html');

export const InfoNotificationItem: React.FC<Props> = ({ notification, me, className }) => {
  const cls = useStyles();

  return (
    <div className={cx(cls.container, className)}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          textAlign: 'right',
        }}
      >
        <div style={{alignItems: 'center', justifyContent: 'center', display:"flex",marginRight: spacers.small,}}>
        <div className={cls.icon}/>
        </div>
        {isDangerouslySetHtml(notification.content) ? (
          <Text size="small1" dangerouslySetInnerHTML={notification.content} style = {{textAlign: 'left'}}/>
        ) : (
          <Text size="small1" style = {{textAlign: 'left'}}>{notification.content}</Text>
        )}
      </div>
    </div>
  );
};

const useStyles = createUseStyles(theme => ({
  container: {
    ...fonts.small1,
    marginBottom: spacers.large,
  },
  iconContainer:{
    display:'flex',
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center',
    marginRight:'10px'
  },
  icon: {
    width:'12px',
    height: '12px',
    background: theme.colors.primary,
    boxSizing: 'border-box',
    borderRadius: '50%',
  }
}));
