import Logger from 'js-logger';

Logger.useDefaults();

export const logsy = Logger;

// // import * as Sentry from 'sentry-expo';
// import config from 'src/config';

// export const logger = {
//   log: console.log,
//   info: console.info,
//   debug: console.debug,
//   warn: console.warn,
//   error: (...args: any[]) => {
//     // Sentry.captureException({
//     //   level: 'error',
//     //   meta: args,
//     // });

//     if (config.DEBUG) {
//       console.warn(...args);
//     }
//   },

//   // This is a case that shouldn't really happen if the application works correctly
//   exception: (title: string, description?: string, meta?: {[k: string]: any}) => {
//     Sentry.captureException({
//       title,
//       level: 'exception',
//       description,
//       meta,
//     });

//     if (config.DEBUG) {
//       console.warn(`Exception: ${title}`, description, meta);
//     }
//   },
// };
