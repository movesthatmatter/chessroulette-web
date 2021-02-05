const DEBUG = process.env.REACT_APP_DEBUG === 'true';
const ENV = process.env.REACT_APP_ENV as 'dev' | 'production' | 'staging';

const WSS_ENDPOINT = process.env.REACT_APP_WSS_ENDPOINT as string;
const HTTP_ENDPOINT = process.env.REACT_APP_HTTP_ENDPOINT as string;
const SIGNALING_SERVER_CONFIG = {
  host: process.env.REACT_APP_SIGNALING_HOST,
  port: Number(process.env.REACT_APP_SIGNALING_PORT),
  secure: Number(process.env.REACT_APP_SIGNALING_SECURE) === 1,
  pingInterval: 30 * 1000,
};

const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN as string;
const GOOGLE_ANALYTICS_TRACKING_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID as string;

// const FACEBOOK = {
//   APP_ID: process.env.REACT_APP_FACEBOOK_APP_ID as string,
// };

const FIREBASE = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY as string,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: process.env.REACT_APP_FIREBASE_APP_ID as string,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID as string,
};

const PRERENDERING = !!(window as any).reactSnapshotRender;

const config = {
  // Env
  DEBUG,
  ENV,

  PRERENDERING,

  // Servers
  WSS_ENDPOINT,
  HTTP_ENDPOINT,
  SIGNALING_SERVER_CONFIG,

  // Vendors
  SENTRY_DSN,
  GOOGLE_ANALYTICS_TRACKING_ID,

  // FACEBOOK,

  // TODO: Takeout
  FIREBASE,
};

if (config.DEBUG) {
  // eslint-disable-next-line no-console
  console.log('App Config', config);
}

export default config;
