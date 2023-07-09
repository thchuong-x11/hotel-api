import * as localConfig from './env/local.conf';
import * as productionConfig from './env/production.conf';
import * as stagingConfig from './env/staging.conf';
import * as testConfig from './env/test.conf';
import { validateStringEnvVar } from './env-var-validation';
import { Config } from './types/config';

const serviceConfigs = {
  local: localConfig,
  test: testConfig,
  staging: stagingConfig,
  production: productionConfig,
};

type ServiceConfigs = keyof typeof serviceConfigs;

const configs = validateStringEnvVar<ServiceConfigs>(process.env.NODE_ENV, serviceConfigs);

const config: Config = serviceConfigs[configs];

export default config;
