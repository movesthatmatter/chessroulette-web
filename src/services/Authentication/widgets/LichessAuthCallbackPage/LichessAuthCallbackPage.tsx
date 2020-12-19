/* eslint-disable @typescript-eslint/no-unused-expressions */

import React, { useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';

// TODO: This was removed during the Big Refactoring b/c
//  it was too big. If you wamnt it back build a little util fn
// import queryString from 'query-string';
import { WindowWithOnTokenReceived } from '../types';

type Props = {};

export const LichessAuthCallbackPage: React.FC<Props> = (props) => {
  const cls = useStyles();

  useEffect(() => {
    // TODO: This was removeed during the Big Refactoring
    // const { token } = queryString.parse(window.location.search);

    // if (typeof token === 'string' && token.length > 0) {
    //   (window.opener as WindowWithOnTokenReceived).onTokenReceived?.(token);
    //   window.close();
    // }
  }, []);

  return <div className={cls.container}>Lichess Callback Page</div>;
};

const useStyles = createUseStyles({
  container: {},
});
