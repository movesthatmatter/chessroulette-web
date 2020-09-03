import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Box, Layer } from 'grommet';
import { noop } from 'src/lib/util';
import { Modal } from '../Modal/Modal';
import { PopupContent } from '../PopupContent';
import { Button } from '../Button';
import { FaceTime } from '../FaceTimeArea';
import { FaceTimeSetup } from '../FaceTimeArea/FaceTimeSetup';

type Props = {
  type: 'friendly' | 'challenge';
  onSubmit?: () => void;
};

type VisiblePopup = 'none' | 'friendly' | 'challenge';

export const PlayButtonWidget: React.FC<Props> = ({
  type,
  onSubmit = noop,
}) => {
  const cls = useStyles();
  const [visiblePopup, setVisiblePopup] = useState<VisiblePopup>('none');
  const [faceTimeOn, setFaceTimeOn] = useState(false);

  return (
    <Box margin="small">
      <Button
        onClick={() => { setVisiblePopup(type); }}
        size="medium"
        label={type === 'friendly' ? 'Play a Friend' : 'Challenge'}
      />
      {visiblePopup === 'challenge' && (
        <Layer position="center">
          <Box pad="medium" gap="small" width="medium">
            <FaceTimeSetup onUpdated={(s) => setFaceTimeOn(s.on)} />
            Create challenge
            <Button
              type="button"
              label="Submit"
              primary
              onClick={onSubmit}
              disabled={!faceTimeOn}
            />
            <Button
              type="button"
              label="Cancel"
              onClick={() => setVisiblePopup('none')}
            />
          </Box>
        </Layer>
      )}

      {visiblePopup === 'friendly' && (
        <Layer position="center">
          <Box pad="medium" gap="small" width="medium">
            <FaceTimeSetup onUpdated={(s) => setFaceTimeOn(s.on)} />

            Play a Friend
            <Button
              type="button"
              label="Submit"
              primary
              onClick={onSubmit}
              disabled={!faceTimeOn}
            />
            <Button
              type="button"
              label="Cancel"
              onClick={() => setVisiblePopup('none')}
            />
          </Box>
        </Layer>
      )}
    </Box>
  );
};

const useStyles = createUseStyles({
  container: {},
});
