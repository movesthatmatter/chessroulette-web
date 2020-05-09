/* eslint-disable no-console */
import { WebDataEventChannel } from '../WebDataEventChannel';

const logUnimportantStyle = 'color: grey;';
const logImportantStyle = 'font-weight: bold;';
const logIncomingStyle = 'color: #4CAF50; font-weight: bold;';
const logOutgoingStyle = 'color: #1EA7FD; font-weight: bold;';
const logOpenConnectionStyle = 'color: #EF5FA0; font-weight: bold';
const logClosedConnectionStyle = 'color: #DF9D04; font-weight: bold';
const logErrorStyle = 'color: red; font-weight: bold;';


export const addLogger = (
  namespace: string,
  channel: WebDataEventChannel,
) => {
  channel.addEventListener('open', (event) => {
    console.group(
      `%c${namespace} %cConnection Opened`,
      logUnimportantStyle,
      logOpenConnectionStyle,
    );
    console.log('Event', event);
    console.groupEnd();

    return event;
  });

  channel.addEventListener('close', (event) => {
    console.group(
      `%c${namespace} %cConnection Closed`,
      logUnimportantStyle,
      logClosedConnectionStyle,
    );
    console.log('Event', event);
    console.groupEnd();

    return event;
  });

  channel.addEventListener('error', (event) => {
    console.group(
      `%c${namespace} %cError`,
      logUnimportantStyle,
      logErrorStyle,
    );
    console.log('Event', event);
    console.groupEnd();

    return event;
  });

  channel.addEventInterceptors('message', [
    (event) => ({
      ...event,
      data: JSON.parse(event.data),
    }),
    (event) => {
      const msg = event?.data;

      console.group(
        `%c${namespace} %cIncoming Msg:`,
        logUnimportantStyle,
        logIncomingStyle,
      );
      console.log('From   :', msg?.fromPeerId);
      console.log('To     :', msg?.toPeerId);
      console.log('Sent at:', new Date(msg?.timestamp));

      console.group('Message');
      const { msgType, content, ...rest } = msg?.message ?? {};

      console.log('Kind:', msgType);
      console.log('Content:', content);

      Object.keys(rest).forEach((k) => {
        console.log(k, rest[k]);
      });
      console.groupEnd();

      console.groupEnd();

      return event;
    },
    (event) => ({
      ...event,
      data: JSON.stringify(event.data),
    }),
  ]);

  channel.addSendInterceptors([
    (data: any) => JSON.parse(data),
    (data: any) => {
      const msg = data;

      console.group(
        `%c${namespace} %cOutgoing Msg:`,
        logUnimportantStyle,
        logOutgoingStyle,
      );
      console.log('From   :', msg?.fromPeerId);
      console.log('To     :', msg?.toPeerId);
      console.log('Sent at:', new Date(msg?.timestamp * 1000));

      console.group('Message');
      const { msgType, content, ...rest } = msg?.message ?? {};

      console.log('Kind:', msgType);
      console.log('Content:', content);

      Object.keys(rest).forEach((k) => {
        console.log(k, rest[k]);
      });
      console.groupEnd();

      console.groupEnd();

      return data;
    },
    (data) => JSON.stringify(data),
  ]);
};
