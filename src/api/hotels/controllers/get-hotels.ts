import { Request, Response } from 'express';

import { serializeHotel } from '../serializers/hotel.serializer';

export async function getHotels(req: Request<unknown, unknown, unknown, unknown>, res: Response) {
  try {
    const hotels = await req.ctx.getHotelsService.run();
    res.status(200).json({ hotels: hotels.map((hotel) => serializeHotel(hotel)) });
  } catch (err) {
    req.ctx.logger.error('getHotels failed', err);
    res.status(500).json({});
  }
}
