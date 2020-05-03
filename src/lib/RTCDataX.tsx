import {
  WebDataEventChannelFrom,
  getWebDataEventChannel,
} from './WebDataEventChannel/WebDataEventChannel';
import {
  addLoggingInterceptors,
  addJsonParseInterceptors,
} from './WebDataEventChannel/interceptors';

export type RTCDataX = WebDataEventChannelFrom<RTCDataChannel>;

export const getRTCDataXConnection = (channel: RTCDataChannel) => {
  const instance = getWebDataEventChannel(channel) as RTCDataX;

  // addJsonParseInterceptors(instance);
  addLoggingInterceptors('RTCDataX', instance);

  return instance;
};
