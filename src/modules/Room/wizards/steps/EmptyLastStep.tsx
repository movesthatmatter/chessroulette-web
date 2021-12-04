import React, { useEffect } from 'react';
import { UnknownAsyncResult } from 'src/lib/types';

type Props = {
  onFinished: () => UnknownAsyncResult;
};

/**
 * This is needed just to call onFinished if no other
 * previous steps can call onFinished (b/c there might not be any for ex)
 *
 * @param props
 */
export const EmptyLastStep: React.FC<Props> = (props) => {
  useEffect(() => {
    props.onFinished();
  }, []);

  return null;
};
