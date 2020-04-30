import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import HTTPProvider, { HTTPContext } from './services/HTTPProvider';

WebFont.load({
  google: {
    families: [
      'Open Sans:300,400,700',
      'Roboto:300,400,700',
      'Roboto Slab:300,400,700',
      'sans-serif',
    ],
  },
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <HTTPContext.Provider value={new HTTPProvider()}>
        <App />
      </HTTPContext.Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
