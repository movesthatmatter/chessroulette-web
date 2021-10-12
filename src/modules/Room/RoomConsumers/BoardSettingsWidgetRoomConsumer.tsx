import React from 'react';
import { IconButton } from 'src/components/Button';
import { useRoomConsumer } from './useRoomConsumer';
import { Swap } from 'react-iconly';
import { createUseStyles } from 'src/lib/jss';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { CustomTheme } from 'src/theme';

type Props = {
  containerClassName?: string;
};

export const BoardSettingsWidgetRoomConsumer: React.FC<Props> = (props) => {
  const cls = useStyles();
  const roomConsumer = useRoomConsumer();
  const { theme } = useColorTheme();

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

const useStyles = createUseStyles<CustomTheme>((theme) => ({
  button: {
    background: theme.colors.primaryLight,
  },
}));
