import express from 'express';

import { injectDependencies as injectDependenciesHotels } from '../api/hotels/dependencies-injection';
import hotelsRouter from '../api/hotels/routes';

import { addRequestContext } from './middlewares/add-request-context';

const app = express();

app.use(express.json());

addRequestContext(app);

// routes

app.use(injectDependenciesHotels, hotelsRouter);

export { app };
