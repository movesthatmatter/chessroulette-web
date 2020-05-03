
const DEBUG = process.env.REACT_APP_DEBUG;

const WSS_ENDPOINT = process.env.REACT_APP_WSS_ENDPOINT as string;

const config = {
  DEBUG,
  WSS_ENDPOINT,
};

export default config;
