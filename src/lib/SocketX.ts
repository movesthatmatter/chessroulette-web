import config from 'src/config';
import {
  getWebDataEventChannel,
  WebDataEventChannelFrom,
} from './WebDataEventChannel/WebDataEventChannel';
import {
  addLoggingInterceptors,
  addJsonParseInterceptors,
} from './WebDataEventChannel/interceptors';

export type SocketX = WebDataEventChannelFrom<WebSocket>;

export const getSocketXConnection = (url = config.WSS_ENDPOINT) => {
  const instance = getWebDataEventChannel(new WebSocket(url)) as SocketX;

  // addJsonParseInterceptors(instance);
  if (config.DEBUG) {
    addLoggingInterceptors('SocketX', instance);
  }

  return instance;
};
