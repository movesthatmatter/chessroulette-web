
const DEBUG = !!process.env.REACT_APP_DEBUG;
const ENV = process.env.REACT_APP_ENV as 'dev' | 'production' | 'staging';

const WSS_ENDPOINT = process.env.REACT_APP_WSS_ENDPOINT as string;
const HTTP_ENDPOINT = process.env.REACT_APP_HTTP_ENDPOINT as string;
const REACT_APP_ICE_SERVERS = JSON.parse(process.env.REACT_APP_ICE_SERVERS as string) as string[];

const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN as string;

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
};

export default config;
