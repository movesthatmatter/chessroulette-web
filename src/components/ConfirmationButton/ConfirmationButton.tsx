import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Box, Layer } from 'grommet';
import { Button, ButtonProps } from 'src/components/Button';
import { noop } from 'src/lib/util';

type Props = {
  onSubmit?: () => void;
  label: string;
  buttonProps?: ButtonProps;
  confirmationPopupContent: React.ReactElement;
  confirmationPopup?: React.ReactElement;
};

export const ConfirmationButton: React.FC<Props> = ({
  onSubmit = noop,
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
          type="button"
          label="Submit"
          primary
          onClick={() => {
            setIsConfirmationPopupVisible(false);
            onSubmit();
          }}
        />
        <Button
          type="button"
          label="Cancel"
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
        size="medium"
        label={props.label}
      />
      {isConfirmationPopupVisible && popup}
    </>
  );
};

const useStyles = createUseStyles({
  container: {},
});
