import React, { useState } from 'react';
import { Box, Layer } from 'grommet';
import { noop } from 'src/lib/util';
import { ChessChallengeCreator } from 'src/modules/Games/Chess/components/ChessChallengeCreator';
import { GameInitConfig } from 'dstnd-io';
import { Button } from '../Button';
import { FaceTimeSetup } from '../FaceTimeArea/FaceTimeSetup';

type Props = {
  onSubmit?: (gameInitConfig: GameInitConfig) => void;
  buttonLabel: string;
};

export const PlayButtonWidget: React.FC<Props> = ({
  onSubmit = noop,
  ...props
}) => {
  const [visiblePopup, setVisiblePopup] = useState<boolean>(false);
  const [faceTimeOn, setFaceTimeOn] = useState(false);
  const [gameInitConfig, setGameInitConfig] = useState<
    GameInitConfig | undefined
  >(undefined);

  const submit = () => {
    if (!gameInitConfig) {
      return;
    }

    onSubmit(gameInitConfig);
  };

  return (
    <Box margin="small">
      <Button
        onClick={() => {
          setVisiblePopup(true);
        }}
        size="medium"
        label={props.buttonLabel}
      />
      {visiblePopup && (
        <Layer position="center">
          <Box pad="medium" gap="small" width="medium">
            <FaceTimeSetup onUpdated={(s) => setFaceTimeOn(s.on)} />
            <Box>
              <ChessChallengeCreator onUpdate={setGameInitConfig} />
            </Box>
            <Button
              type="button"
              label="Create Challenge"
              primary
              onClick={submit}
              disabled={!(faceTimeOn && gameInitConfig)}
              // margin={{ bottom: 'small' }}
            />
            <Button
              type="button"
              label="Cancel"
              onClick={() => setVisiblePopup(false)}
            />
          </Box>
        </Layer>
      )}
    </Box>
  );
};
