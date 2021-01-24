import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import config from 'src/config';
import { getFirebase } from 'react-redux-firebase'


const middlewares = [
  thunk.withExtraArgument(getFirebase),
  ...(config.DEBUG ? [logger] : [])
];

export const enhancer = config.DEBUG
  ? composeWithDevTools(applyMiddleware(...middlewares))
  : applyMiddleware(...middlewares);
