import React from 'react';
import { IconButton } from 'src/components/Button';
import { useRoomConsumer } from './useRoomConsumer';
import { Swap } from 'react-iconly';

type Props = {
  containerClassName?: string;
};

export const BoardSettingsWidgetRoomConsumer: React.FC<Props> = (props) => {
  const roomConsumer = useRoomConsumer();

  return (
    <div className={props.containerClassName}>
      <IconButton
        type="primary"
        size="small"
        title="Flip Board"
        iconType="iconly"
        icon={Swap}
        onSubmit={() => {
          if (!roomConsumer) {
            return;
          }

          roomConsumer.setBoardOrientation((prev) => (prev === 'home' ? 'away' : 'home'));
        }}
      />
    </div>
  );
};
