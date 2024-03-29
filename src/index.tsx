/// <reference types="@welldone-software/why-did-you-render" />
import './wdyr'; // needs to be the 1st import

import React from 'react';
import './index.css';
import WebFont from 'webfontloader';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { render } from 'react-snapshot';
import { ReduxProvider } from './redux/Provider';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import config from './config';

if (config.ENV === 'production') {
  Sentry.init({
    dsn: config.SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.1,
  });
}

WebFont.load({
  google: {
    families: [
      'Open Sans:300',
      'Open Sans:400',
      'Open Sans:700',
      'Lato',
      'Lato:300',
      'Lato:400',
      'Lato:500',
      'Lato:600',
      'Lato:700',
      'Lato:800',
      'Lato:900',
      'sans-serif',
    ],
  },
});

render(
  // Note: Dec 10, 2020 – Took this out b/c it makes components
  //  mount twice. This is bad especially if I'm trying to instantiate
  //  something only once :)
  // This shouldn't affect production build though but I'm still taking it out.
  // Its good for dev mode so you might want to use it to check things out
  //  every now and then!
  // Also See https://stackoverflow.com/questions/49055172/react-component-mounting-twice
  // <React.StrictMode>
  <BrowserRouter>
    <ReduxProvider>
      <App />
    </ReduxProvider>
  </BrowserRouter>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
