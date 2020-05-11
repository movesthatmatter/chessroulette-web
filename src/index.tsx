import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import WebFont from 'webfontloader';
import App from './App';
import * as serviceWorker from './serviceWorker';

WebFont.load({
  google: {
    families: [
      'Open Sans:300', 'Open Sans:400', 'Open Sans:700',
      'Roboto:300', 'Roboto:400', 'Roboto:700',
      'Roboto Slab:300', 'Roboto Slab:400', 'Roboto Slab:700',
      'sans-serif',
    ],
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
