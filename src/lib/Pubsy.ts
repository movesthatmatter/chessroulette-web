export class Pubsy<TChannelPayloadMap extends {[k: string]: unknown}> {
  private subscribers: {
    [channel: string]: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [subId: string]: (data: any) => void;
    };
  } = {};

  subscribe<
    TChannel extends keyof TChannelPayloadMap
  >(channel: TChannel, fn: (data: TChannelPayloadMap[TChannel]) => void) {
    const subId = String(Math.random()).slice(2);

    const channelName = String(channel);

    this.subscribers[channelName] = this.subscribers[channelName] || {};

    this.subscribers[channelName][subId] = fn;

    // Unsubscriber
    return () => {
      if (this.subscribers[channelName]) {
        const { [subId]: removed, ...rest } = this.subscribers[channelName];

        this.subscribers[channelName] = rest;
      }

      if (Object.keys(this.subscribers[channelName]).length === 0) {
        delete this.subscribers[channelName];
      }
    };
  }

  publish<
    TChannel extends keyof TChannelPayloadMap
  >(channel: TChannel, data: TChannelPayloadMap[TChannel]) {
    const channelName = String(channel);

    if (!this.subscribers[channelName]) {
      // If no subscribers return early
      return;
    }

    Object.values(this.subscribers[channelName]).forEach((sub) => {
      sub(data);
    });
  }
}
