import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import config from 'src/config';

const middlewares = [
  thunk,
  ...config.DEBUG ? [logger] : [],
];

export const enhancer = config.DEBUG
  ? composeWithDevTools(applyMiddleware(...middlewares))
  : applyMiddleware(...middlewares);
