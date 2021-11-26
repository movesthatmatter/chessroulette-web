import React, { useEffect, useState } from 'react';
import { Button } from 'src/components/Button';
import { Dialog } from 'src/components/Dialog';
import { Text } from 'src/components/Text';
import { TextInput } from 'src/components/TextInput';
import { createUseStyles } from 'src/lib/jss';
import { Game } from 'src/modules/Games';
import { console } from 'window-or-global';
import { getTimeInMinutesAndSeconds } from '../utils';

type Props = {
  game: Game;
  onClose: () => void;
  onSubmit: ({ white, black }: { white: number; black: number }) => void;
  visible: boolean;
};

export const TimerAdjustmentDialog: React.FC<Props> = ({ game, onClose, onSubmit, visible }) => {
  const cls = useStyles();
  const [timerInputWhite, setTimerInputWhite] = useState<{ minutes: string; seconds: string }>({
    minutes: getTimeInMinutesAndSeconds(game.timeLeft.white).minutes.toString(),
    seconds: getTimeInMinutesAndSeconds(game.timeLeft.white).seconds.toString(),
  });
  const [timerInputBlack, setTimerInputBlack] = useState<{ minutes: string; seconds: string }>({
    minutes: getTimeInMinutesAndSeconds(game.timeLeft.black).minutes.toString(),
    seconds: getTimeInMinutesAndSeconds(game.timeLeft.black).seconds.toString(),
  });

  useEffect(() => {
    console.group('timers values now');
    console.log('white', timerInputWhite);
    console.log('black', timerInputBlack);
    console.groupEnd();
  }, [timerInputBlack, timerInputWhite]);

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      hasCloseButton
      content={
        <div className={cls.dialog}>
          <Text>Time Left</Text>
          <Text>White Player :</Text>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <TextInput
              label="Minutes"
              type="number"
              defaultValue={timerInputWhite.minutes}
              placeholder={timerInputWhite.minutes}
              onChange={(e) => {
                if (typeof e.currentTarget.value === 'string'){
                  setTimerInputWhite((prev) => ({ ...prev, minutes: e.currentTarget.value }));
                } 
              }}
            />
            <TextInput
              label="seconds"
              defaultValue={timerInputWhite.seconds}
              placeholder={timerInputWhite.seconds}
              type="number"
              onChange={(e) => {
                setTimerInputWhite((prev) => ({ ...prev, seconds: e.currentTarget.value }));
              }}
            />
          </div>
          <Text>Black Player :</Text>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <TextInput
              label="Minutes"
              type="number"
              defaultValue={timerInputBlack.minutes}
              placeholder={timerInputBlack.minutes}
              onChange={(e) => {
                setTimerInputBlack((prev) => ({ ...prev, minutes: e.currentTarget.value }));
              }}
            />
            <TextInput
              label="seconds"
              type="number"
              defaultValue={timerInputBlack.seconds}
              placeholder={timerInputBlack.seconds}
              onChange={(e) => {
                setTimerInputBlack((prev) => ({ ...prev, seconds: e.currentTarget.value }));
              }}
            />
          </div>
          <Button
            type="positive"
            label="Submit"
            onClick={() => {
              console.group('timers values now');
              console.log('white', timerInputWhite);
              console.log('black', timerInputBlack);
              console.groupEnd();
              onSubmit({
                white:
                  (Number(timerInputWhite.minutes) * 60 + Number(timerInputWhite.seconds)) * 1000,
                black:
                  (Number(timerInputBlack.minutes) * 60 + Number(timerInputBlack.seconds)) * 1000,
              });
            }}
          />
        </div>
      }
    />
  );
};

const useStyles = createUseStyles({
  container: {},
  dialog: {
    display: 'flex',
    flexDirection: 'column',
  },
});
