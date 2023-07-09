import express from 'express';

import { validateQueryParams } from '../../server/middlewares/validate-query-params';

import { getHotels } from './controllers/get-hotels';
import { GetHotelsSchema } from './interfaces/get-hotels-api.interface';

const router = express.Router();
const group = '/hotels';

router.get(`${group}`, validateQueryParams(GetHotelsSchema), getHotels);

export default router;
