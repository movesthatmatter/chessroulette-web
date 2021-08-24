import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Wizard } from 'react-use-wizard';
import { Dialog, DialogProps } from '../Dialog/Dialog';

type Props = Omit<DialogProps, 'content'>;

export const DialogWizard: React.FC<Props> = (props) => {
  const cls = useStyles();

  return <Dialog content={<Wizard>{props.children}</Wizard>} {...props} />;
};

const useStyles = createUseStyles({
  container: {},
});
