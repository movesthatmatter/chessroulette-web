import capitalize from 'capitalize';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, ButtonProps } from 'src/components/Button';
import { createUseStyles } from 'src/lib/jss';
import { noop } from 'src/lib/util';
import { Notification, selectActivityLog } from 'src/providers/PeerProvider';

type Props = {
  notification: Notification;
};

function returnCurrentDate(): string {
  return format(new Date(), 'HH:MM:ss a');
}

export const NotificationItem: React.FC<Props> = ({ notification }) => {
  const cls = useStyles();

  // if (notification.buttons) {
  //   if (notification.resolved) {
  //     return (
  //       <div
  //         style={{
  //           display: 'flex',
  //           flexDirection: 'row',
  //           justifyContent: 'space-between',
  //         }}
  //       >
  //         {notification.content}
  //         <div>{returnCurrentDate()}</div>
  //       </div>
  //     );
  //   }
  //   return (
  //     <div
  //       style={{
  //         display: 'flex',
  //         flexDirection: 'column',
  //       }}
  //     >
  //       <div
  //         style={{
  //           marginBottom: '5px',
  //         }}
  //       >
  //         {notification.content}
  //       </div>
  //       <div
  //         style={{
  //           display: 'flex',
  //           flexDirection: 'row',
  //           justifyContent: 'center',
  //         }}
  //       >
  //         {notification.buttons.map((button) => (
  //           <Button {...button} style={{ marginRight: '10px' }} size="small" onClick={noop} />
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className={cls.container}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {notification.content}
        <div>{returnCurrentDate()}</div>
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
});
