import Logger from 'js-logger';
import * as Sentry from '@sentry/browser';
import config from 'src/config';
import { ILogHandler } from 'js-logger/src/types';

if (config.ENV === 'production') {
  Sentry.init({ dsn: config.SENTRY_DSN });
}

Logger.useDefaults();

export const logsy = Logger;

const logsyToSentrySeverityMap = {
  error: 'error',
  warn: 'warning',
  log: 'info',
  info: 'info',
  debug: 'debug',

  // Unhandled
  fatal: 'fatal',
  critical: 'critical',
};

logsy.createDefaultHandler({
  formatter(messages) {
    // prefix each log message with a timestamp.
    messages.unshift(new Date().toUTCString());
  },
});

const consoleHandler = Logger.createDefaultHandler();
const sentryHandler = (...[messages, context]: Parameters<ILogHandler>) => {
  // Only track Warnings and up (Errors, Critical, etc);
  if (context.level.value < 5) {
    return;
  }

  const msgsAsArray = Array.prototype.slice.call(messages);

  const level = String(context.level.name).toLowerCase();

  Sentry.captureMessage(
    msgsAsArray.join(' '),
    (logsyToSentrySeverityMap as any)[level] || 'critical'
  );
};

logsy.setHandler((messages, context) => {
  if (config.DEBUG) {
    consoleHandler(messages, context);
  } else {
    sentryHandler(messages, context);
  }
});
