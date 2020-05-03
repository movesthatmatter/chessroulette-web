/* eslint-disable max-classes-per-file */
interface EventMap {
  close: CloseEvent;
  error: Event;
  message: MessageEvent;
  open: Event;
}

export interface EventChannel {
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;

  addEventListener<K extends keyof EventMap>(
    type: K,
    listener: (this: EventChannel, ev: EventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
}

export function getWebDataEventChannel(channel: EventChannel) {
  const eventInterceptors: { [k: string]: Function[] } = {
    open: [],
    close: [],
    message: [],
    error: [],
  };

  const sendInterceptors: Function[] = [];

  const oldEventListener = channel.addEventListener.bind(channel);
  const addEventListener = <K extends keyof EventMap>(
    type: K,
    listener: (ev: EventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): ReturnType<EventChannel['addEventListener']> =>
    oldEventListener(
      type,
      (event) => {
        const transformedEvent = eventInterceptors[type].reduce(
          (res, nextTransformer) => nextTransformer(res),
          event,
        );

        return listener(transformedEvent);
      },
      options,
    );

  const sendJSON = <T extends object>(data: T) => {
    const transformedData = sendInterceptors.reduce(
      (res, nextTransformer) => nextTransformer(res),
      data,
    );

    return channel.send(JSON.stringify(transformedData));
  };

  const oldSend = channel.send.bind(channel);
  const send = (...[data]: Parameters<EventChannel['send']>) => {
    const transformedData = sendInterceptors.reduce(
      (res, nextTransformer) => nextTransformer(res),
      data,
    );

    return oldSend(transformedData);
  };

  const addEventInterceptor = <K extends keyof EventMap>(
    type: K,
    transformer: (ev: EventMap[K]) => EventMap[K],
  ) => {
    eventInterceptors[type].push(transformer);
  };

  const addEventInterceptors = <K extends keyof EventMap>(
    type: K,
    transformers: ((ev: EventMap[K]) => EventMap[K])[],
  ) => {
    transformers.forEach((t) => {
      addEventInterceptor(type, t);
    });
  };

  const addSendInterceptor = (transformer: (msg: unknown) => unknown) => {
    sendInterceptors.push(transformer);
  };

  const addSendInterceptors = (transformers: ((msg: unknown) => unknown)[]) => {
    transformers.forEach((t) => addSendInterceptor(t));
  };

  return Object.assign(channel, {
    send,
    sendJSON,
    addEventListener,
    addEventInterceptor,
    addEventInterceptors,
    addSendInterceptor,
    addSendInterceptors,
  });
}

export type WebDataEventChannel = ReturnType<typeof getWebDataEventChannel>;
export type WebDataEventChannelFrom<
  TBase extends EventChannel
> = TBase & WebDataEventChannel;
