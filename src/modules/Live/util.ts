import { logsy } from 'src/lib/logsy';
import { delay } from 'src/lib/time';
import { TwitchSDK } from './twitchSDK/loadTwitchApi';

export const createElement = (channel: string) => {
  const container = document.createElement('div');

  container.id = `twitch--${channel}`;
  container.style.display = 'none';

  document.body.append(container);

  return {
    id: container.id,
    remove: () => {
      const elem = document.querySelector(`#${container.id}`);

      if (elem?.parentNode) {
        elem.parentNode.removeChild(elem);
      }
    },
  };
};

export const promiseFirstResolvedInSeries = <T>(
  promiseGetters: (() => Promise<T>)[]
): Promise<T> => {
  const firstPromise = promiseGetters[0]?.();

  if (promiseGetters.length === 0) {
    return Promise.reject('Exhausted');
  }

  return firstPromise.catch(() => promiseFirstResolvedInSeries(promiseGetters.slice(1)));
};

export const waitForSingleEventAsPromise = <TEvent extends string>(
  eventObject: {
    addEventListener: (e: TEvent, cb: (a: unknown) => void) => void;
    removeEventListener: (e: TEvent, cb: (a: unknown) => void) => void;
  },
  name: TEvent,
  timeout = 5000
) => {
  let registeredEventCb: (a: unknown) => void;

  return Promise.race([
    new Promise((resolve) => {
      registeredEventCb = resolve;
      eventObject.addEventListener(name, registeredEventCb);
    }),
    delay(timeout).then(() => Promise.reject(`[WaitForEvent] Event Timed Out: ${name}`)),
  ]).finally(() => {
    eventObject.removeEventListener(name, registeredEventCb);
  });
};

export const isTwitchChannelLive = async (channel: string, Twitch: TwitchSDK): Promise<boolean> => {
  const { id: containerId, remove: removeEmbedContainer } = createElement(channel);

  const player = new Twitch.Player(containerId, {
    channel,
    // Don't start the video as this will try load a lot of resources!
    autoplay: false,
    muted: true,
    parent: [window.location.hostname],
  });

  try {
    await waitForSingleEventAsPromise(player, (Twitch.Player as any).READY, 3000);

    const isPlayerStateDifferentThanIdle = () =>
      (player as any).getPlayerState()?.playback !== 'Idle';

    const maxWait = 500;

    return Promise.race([
      // Try after a 10th and delay again if not
      delay(maxWait / 10)
        .then(isPlayerStateDifferentThanIdle)
        .then((isNotIdle) => isNotIdle || delay(maxWait).then(() => false)),
      delay(maxWait / 5)
        .then(isPlayerStateDifferentThanIdle)
        .then((isNotIdle) => isNotIdle || delay(maxWait).then(() => false)),
      // // Try after a halg and delay again if not
      delay(maxWait / 2)
        .then(isPlayerStateDifferentThanIdle)
        .then((isNotIdle) => isNotIdle || delay(maxWait).then(() => false)),
      // // Try again at the end
      delay(maxWait / 1)
        .then(isPlayerStateDifferentThanIdle)
        .then((isNotIdle) => isNotIdle || delay(maxWait).then(() => false)),

      // Wait for the Online Event to kick in as well
      waitForSingleEventAsPromise(player, (Twitch.Player as any).ONLINE, maxWait).then(
        () => true,
        () => false
      ),

      // Fallback if none get fufilled fail it!
      delay(maxWait * 1.1).then(() => false),
    ]).finally(() => {
      removeEmbedContainer();
    });
  } catch (e) {
    logsy.error('isTwitchChannelLive()', e);

    removeEmbedContainer();

    return false;
  }
};
