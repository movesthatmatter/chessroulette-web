
const DEBUG = !!process.env.REACT_APP_DEBUG;
const ENV = process.env.REACT_APP_ENV as 'dev' | 'production' | 'staging';

const WSS_ENDPOINT = process.env.REACT_APP_WSS_ENDPOINT as string;

const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN as string;

const config = {
  DEBUG,
  ENV,
  WSS_ENDPOINT,
  SENTRY_DSN,
};

export default config;
