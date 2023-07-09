/**
 * The entrypoint of the application if we are running it locally (not using serverless
 * nor in a lambda environment).
 *
 * It also sets up a fake AWS environment.
 */

import * as dotenv from 'dotenv';

dotenv.config();

import config from '../config';
import { app } from '../server/server';

const PORT = config.server.port;
app.listen(PORT);
// eslint-disable-next-line no-console
console.debug(`Server running on port ${PORT}`, 'server start');
