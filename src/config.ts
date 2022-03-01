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
const PRERENDERING = !!(window as any).reactSnapshotRender;

const DISCORD_SERVER_ID = process.env.REACT_APP_DISCORD_SERVER_ID as string;
const DISCORD_CHANNEL_ID = process.env.REACT_APP_DISCORD_CHANNEL_ID as string;
const CHALLONGE_API_KEY = process.env.REACT_APP_Challonge_API_KEY as string;
const CHALLONGE_USERNAME = process.env.REACT_APP_Challonge_USERNAME as string;

const config = {
  // Env
  DEBUG,
  ENV,

  PRERENDERING,

  TITLE_SUFFIX: 'Chessroulette',

  // Servers
  WSS_ENDPOINT,
  HTTP_ENDPOINT,
  SIGNALING_SERVER_CONFIG,

  // Vendors
  SENTRY_DSN,
  GOOGLE_ANALYTICS_TRACKING_ID,
  DISCORD_SERVER_ID,
  DISCORD_CHANNEL_ID,
  CHALLONGE_API_KEY,
  CHALLONGE_USERNAME
};

if (config.DEBUG) {
  // eslint-disable-next-line no-console
  console.log('App Config', config);
}

export default config;
