
const DEBUG = process.env.REACT_APP_DEBUG === 'true';
const ENV = process.env.REACT_APP_ENV as 'dev' | 'production' | 'staging';

const WSS_ENDPOINT = process.env.REACT_APP_WSS_ENDPOINT as string;
const HTTP_ENDPOINT = process.env.REACT_APP_HTTP_ENDPOINT as string;
const REACT_APP_ICE_SERVERS = JSON.parse(process.env.REACT_APP_ICE_SERVERS as string) as string[];

const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN as string;
const GOOGLE_ANALYTICS_TRACKING_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID as string;

const config = {
  // Env
  DEBUG,
  ENV,

  // Servers
  WSS_ENDPOINT,
  HTTP_ENDPOINT,
  REACT_APP_ICE_SERVERS,

  // Vendors
  SENTRY_DSN,
  GOOGLE_ANALYTICS_TRACKING_ID,
};

if (config.DEBUG) {
  // eslint-disable-next-line no-console
  console.log('App Config', config);
}

export default config;
