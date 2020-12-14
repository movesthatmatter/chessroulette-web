import React from 'react';
import { Dialog, DialogProps } from 'src/components/Dialog/Dialog';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { Text } from 'src/components/Text';
import { TextInput } from 'src/components/TextInput';
import { createUseStyles } from 'src/lib/jss';

type Props = {
  visible: DialogProps['visible'];
};

export const BrowserNotSupportedDialog: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <Dialog
      visible={props.visible}
      hasCloseButton={false}
      graphic={
        <div
          style={{
            textAlign: 'center',
            paddingBottom: '16px',
          }}
        >
          <Mutunachi
            mid={5}
            width="100px"
            style={{
              width: '30%',
              display: 'inline',
            }}
          />
        </div>
      }
      title="Oops. Your browser isn't supported!"
      content={
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <Text size="small1">
            Chessroulette requires access to your camera and microphone but the browser you're
            using is limited in that regard!
            <br />
            <br />
            For best results please copy and paste this link in <strong>Chrome</strong> or{' '}
            <strong>Safari.</strong>
          </Text>
          <div style={{ paddingBottom: '8px' }} />
          <TextInput value={window.location.href} />
        </div>
      }
    />
  );
};

const useStyles = createUseStyles({
  container: {},
});