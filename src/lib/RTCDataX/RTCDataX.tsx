import {
  WebDataEventChannelFrom,
  getWebDataEventChannel,
} from '../WebDataEventChannel/WebDataEventChannel';
import { addLogger } from './logger';

export type RTCDataX = WebDataEventChannelFrom<RTCDataChannel>;

export const getRTCDataXConnection = (channel: RTCDataChannel) => {
  const instance = getWebDataEventChannel(channel) as RTCDataX;

  addLogger('RTCDataX', instance);

  return instance;
};
