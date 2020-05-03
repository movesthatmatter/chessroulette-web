/* eslint-disable no-console */
import { WebDataEventChannel } from '../WebDataEventChannel';

const logUnimportantStyle = 'color: grey;';
const logImportantStyle = 'font-weight: bold;';
const logIncomingStyle = 'color: #4CAF50; font-weight: bold;';
const logOutgoingStyle = 'color: #1EA7FD; font-weight: bold;';
const logErrorStyle = 'color: red; font-weight: bold;';


export const addLoggingInterceptors = (namespace: string, channel: WebDataEventChannel) => {
  channel.addEventInterceptors('message', [
    (event) => ({
      ...event,
      data: JSON.parse(event.data),
    }),
    (event) => {
      console.group(
        `%c${namespace} %cIncoming Msg:`,
        logUnimportantStyle,
        logIncomingStyle,
      );
      console.log('Type   :', event.data.msg_type);
      console.log('Content:', event.data.content);
      // console.log(event.data);
      console.groupEnd();

      return event;
    },
    (event) => ({
      ...event,
      data: JSON.stringify(event.data),
    }),
  ]);

  channel.addEventInterceptors('open', [
    (event) => {
      console.log(
        `%c${namespace} %cConnection Opened:`,
        logUnimportantStyle,
        logErrorStyle,
      );
      // console.groupEnd();

      return event;
    },
  ]);

  channel.addEventInterceptors('close', [
    (event) => {
      console.group(
        `%c${namespace} %cConnection Closed:`,
        logUnimportantStyle,
        logErrorStyle,
      );
      console.log('Reason:', event.reason);
      console.groupEnd();

      return event;
    },
  ]);

  channel.addSendInterceptors([
    (data: any) => JSON.parse(data),
    (data: any) => {
      console.group(
        `%c${namespace} %cOutgoing Msg:`,
        logUnimportantStyle,
        logOutgoingStyle,
      );
      // console.log(data);
      console.log('Type   :', data.msg_type);
      console.log('Content:', data.content);
      console.groupEnd();

      return data;
    },
    (data) => JSON.stringify(data),
  ]);
};
