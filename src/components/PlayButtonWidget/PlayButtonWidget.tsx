import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Button, Box } from 'grommet';
import { noop } from 'src/lib/util';
import { Modal } from '../Modal/Modal';
import { PopupContent } from '../PopupContent';

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

  return (
    <>
      <Button
        type="button"
        primary
        fill
        className={cls.button}
        onClick={() => { setVisiblePopup(type); }}
        label={type === 'friendly' ? 'Play a Friend' : 'Challenge'}
      />

      <Modal visible={visiblePopup === 'challenge'}>
        <PopupContent
          hasCloseButton
          onClose={() => setVisiblePopup('none')}
        >
          <Box>
            Create challenge
            <Button
              type="button"
              onClick={onSubmit}
            />
          </Box>
        </PopupContent>
      </Modal>

      <Modal visible={visiblePopup === 'friendly'}>
        <PopupContent
          hasCloseButton
          onClose={() => setVisiblePopup('none')}
        >
          <Box>
            play a friend
          </Box>
        </PopupContent>
      </Modal>
    </>
  );
};

const useStyles = createUseStyles({
  container: {},
  button: {
    marginBottom: '1.5em',
    '&:hover': {
      opacity: 0.8,
    },
  },
});
