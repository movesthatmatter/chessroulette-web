import React, { useCallback } from 'react';
import { IconButton } from 'src/components/Button';
import { useRoomConsumer } from './useRoomConsumer';
import { Swap } from 'react-iconly';
import { createUseStyles } from 'src/lib/jss';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';

type Props = {
  containerClassName?: string;
};

export const BoardSettingsWidgetRoomConsumer: React.FC<Props> = React.memo((props) => {
  const cls = useStyles();
  const roomConsumer = useRoomConsumer();
  const { theme } = useColorTheme();

  // Performance Optimization
  const onSubmit = useCallback(() => {
    if (!roomConsumer) {
      return;
    }

    roomConsumer.setBoardOrientation((prev) => (prev === 'home' ? 'away' : 'home'));
  }, [roomConsumer]);

  return (
    <div className={props.containerClassName}>
      <IconButton
        type="primary"
        size="default"
        title="Flip Board"
        iconPrimaryColor={theme.colors.white}
        className={cls.button}
        iconType="iconly"
        icon={Swap}
        onSubmit={onSubmit}
      />
    </div>
  );
});

const useStyles = createUseStyles((theme) => ({
  button: {
    background: theme.colors.primaryLight,
    marginBottom: 0,
  },
}));
