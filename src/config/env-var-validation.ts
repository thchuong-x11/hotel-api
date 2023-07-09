import { ConfigPerEnv } from './types/config';

function isEnvVar<T extends string>(
  envVar: string | undefined,
  envPossibleKeys: { [K in T]: ConfigPerEnv | string },
): envVar is T {
  return envVar !== undefined && Object.prototype.hasOwnProperty.call(envPossibleKeys, envVar);
}
/**
 * Validates an env var, throws if it is invalid and no default value is provided
 * https://stackoverflow.com/questions/36836011/checking-validity-of-string-literal-union-type-at-runtime
 */
export function validateStringEnvVar<T extends string>(
  envVar: string | undefined,
  envPossibleKeys: { [K in T]: ConfigPerEnv | string },
  defaultValue?: T,
): T {
  if (isEnvVar<T>(envVar, envPossibleKeys)) {
    return envVar;
  }
  if (defaultValue !== undefined) {
    // requiring logger would be a circular dependency
    // eslint-disable-next-line no-console
    console.log(
      `Environnement variable with value "${envVar}" expected in "${Object.keys(
        envPossibleKeys,
      )}", using default value "${defaultValue}"`,
    );
    return defaultValue;
  }
  throw new Error(
    `Wrong environment variable ; got : "${envVar}", expected value in : "${Object.keys(
      envPossibleKeys,
    )}" and no default value was provided.`,
  );
}
