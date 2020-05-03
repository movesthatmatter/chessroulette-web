import {
  getWebDataEventChannel, WebDataEventChannelFrom,
} from './WebDataEventChannel/WebDataEventChannel';
import {
  addLoggingInterceptors,
  addJsonParseInterceptors,
} from './WebDataEventChannel/interceptors';

export type SocketX = WebDataEventChannelFrom<WebSocket>;

export const getSocketXConnection = (url: string) => {
  const instance = getWebDataEventChannel(new WebSocket(url)) as SocketX;

  // addJsonParseInterceptors(instance);
  addLoggingInterceptors('SocketX', instance);

  return instance;
};
