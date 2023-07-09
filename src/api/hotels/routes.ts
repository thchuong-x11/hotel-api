import express from 'express';

import { getHotels } from './controllers/get-hotels';

const router = express.Router();
const group = '/hotels';

router.get(`${group}`, getHotels);

export default router;
