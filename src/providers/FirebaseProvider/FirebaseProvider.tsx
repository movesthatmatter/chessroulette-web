import React from 'react';
import { Dispatch } from 'redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import config from 'src/config';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

firebase.initializeApp({
  ...config.FIREBASE,
});

firebase.auth();

type Props = {
  dispatch: Dispatch;
};

export const FirebaseProvider: React.FC<Props> = (props) => (
  <ReactReduxFirebaseProvider
    dispatch={props.dispatch}
    firebase={firebase}
    config={{
      userProfile: 'users',
    }}
  >
    {props.children}
  </ReactReduxFirebaseProvider>
);
