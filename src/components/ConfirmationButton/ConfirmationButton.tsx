import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Box, Layer } from 'grommet';
import { Button, ButtonProps } from 'src/components/Button';
import { noop } from 'src/lib/util';

type Props = {
  onSubmit?: () => void;
  label: string;
  buttonProps?: Omit<ButtonProps, 'onClick'>;
  confirmationPopupContent: React.ReactElement;
  confirmationPopup?: React.ReactElement;
  canSubmit?: boolean;
  submitButtonLabel?: string;
  cancelButtonLabel?: string;
};

export const ConfirmationButton: React.FC<Props> = ({
  onSubmit = noop,
  canSubmit = true,
  ...props
}) => {
  const cls = useStyles();
  const [
    isConfirmationPopupVisible,
    setIsConfirmationPopupVisible,
  ] = useState(false);

  const popup = props.confirmationPopup ? (
    props.confirmationPopup
  ) : (
    <Layer
      position="center"
      onClickOutside={() => setIsConfirmationPopupVisible(true)}
    >
      <Box pad="medium" gap="small" width="medium">
        {props.confirmationPopupContent}
        <Button
          label={props.submitButtonLabel || 'Submit'}
          disabled={!canSubmit}
          type="primary"
          onClick={() => {
            setIsConfirmationPopupVisible(false);
            onSubmit();
          }}
        />
        <Button
          label={props.cancelButtonLabel || 'Cancel'}
          clear
          onClick={() => setIsConfirmationPopupVisible(false)}
        />
      </Box>
    </Layer>
  );

  return (
    <>
      <Button
        {...props.buttonProps}
        onClick={() => setIsConfirmationPopupVisible(true)}
        label={props.label}
      />
      {isConfirmationPopupVisible && popup}
    </>
  );
};

const useStyles = createUseStyles({
  container: {},
});
