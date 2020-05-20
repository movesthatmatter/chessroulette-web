import { WebDataEventChannel } from '../WebDataEventChannel';

export const addJsonParseInterceptors = (channel: WebDataEventChannel) => {
  channel.addEventInterceptors('message', [
    (event) => ({
      ...event,
      data: JSON.parse(event.data),
    }),
  ]);
};
