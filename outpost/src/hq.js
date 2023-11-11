import got from 'got';
import config from './config.js';

const options = {
  prefixUrl: `${new URL(config.HQ).origin}/api`,
  headers: {
    Authorization: `Bearer ${config.key}`,
  },
};

const client = got.extend(options);

export default client;
