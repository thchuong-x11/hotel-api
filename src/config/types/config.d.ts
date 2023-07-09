export type ConfigEnvironment = 'local' | 'test' | 'staging' | 'production';

export type ConfigPerEnv = {
  core: {
    environment: ConfigEnvironment;
  };
  logger: {
    level: LogLevel;
  };
  server: {
    hideError: boolean;
    port: number;
  };
  suppliers: {
    acme: string;
    patagonia: string;
    paperflies: string;
  };
};

export type Config = ConfigPerEnv;
