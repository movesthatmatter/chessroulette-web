// Subscriber

// const token = PubSub.subscribe(
//   PubSubChannels.onRemoteStreamingStart,
//   (
//     _: string,
//     { peerId, stream }: { peerId: string; stream: MediaStream },
//   ) => fn(peerId, stream),
// );

// return () => {
//   PubSub.unsubscribe(token);
// };

// Publisher

// rtc.onData((_, msg) => {
//   // TODO: Create a PubSub forwarder library
//   PubSub.publish(PubSubChannels.onData, msg);
// });

type Unsubscriber = () => void;

type Receiver<TEvent> = (fn: (event: TEvent) => void) => Unsubscriber;

export const forward = <TEvent>(
  receiver: Receiver<TEvent>
  // predicate?: ()
) => {
  let unsubscribeFromReceiver: Unsubscriber | undefined;

  const handlers: { [token: string]: (e: TEvent) => void } = {};

  const proxy = (sub: (event: TEvent) => unknown) => {
    // Subscribe to Receiver only if it has not subscribed before
    if (!unsubscribeFromReceiver) {
      unsubscribeFromReceiver = receiver((e: TEvent) => {
        Object.keys(handlers).forEach((token) => {
          handlers[token](e);
        });
      });
    }

    const token = String(Math.random()).slice(2);

    handlers[token] = sub;

    // Unsubscriber
    return () => {
      delete handlers[token];

      // Unsubscribe from Receiver only if there are no more handlers
      if (Object.keys(handlers).length === 0 && unsubscribeFromReceiver) {
        unsubscribeFromReceiver();
      }
    };
  };

  return proxy;
};

export type Forwarded<TEvent = unknown> = (
  sub: (event: TEvent) => void
) => Unsubscriber;

export const forwardMultiple = <TEvent>(receivers: Receiver<TEvent>[]) => {
  const proxy = (sub: (event: TEvent) => unknown) => {
    const unsubscribers = receivers.map((receiver) => forward(receiver)(sub));

    return () => {
      unsubscribers.forEach((unsubscribe) => {
        unsubscribe();
      });
    };
  };

  return proxy;
};

// const subscribeToOnData = forward(rtc.onData);

// forward(())
