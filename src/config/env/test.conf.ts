import { ConfigPerEnv } from '../types/config';

const config: ConfigPerEnv = {
  core: {
    environment: 'test',
  },
  logger: {
    level: process.env.LOG_LEVEL,
  },
  server: {
    port: 3000,
    hideError: false,
  },
  suppliers: {
    acme: 'https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/acme',
    patagonia: 'https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/patagonia',
    paperflies: 'https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/paperflies',
  },
};

export = config;
