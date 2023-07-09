import { Request, Response } from 'express';

import { GetHotelsParams } from '../interfaces/get-hotels-api.interface';
import { serializeHotel } from '../serializers/hotel.serializer';

export async function getHotels(req: Request<unknown, unknown, unknown, GetHotelsParams>, res: Response) {
  try {
    const hotels = await req.ctx.getHotelsService.run(req.query);
    // NOTE:
    // Instead of returning directly a JSON array, here we return a JSON object, containing the array and its length
    // The advantage is that the JSON object is open to modification. We can for example decide to add pagination to the endpoints
    // and with the JSON object we can simply add the prev and next properties for the pagination.
    res.status(200).json({ hotels: hotels.map((hotel) => serializeHotel(hotel)), count: hotels.length });
  } catch (err) {
    req.ctx.logger.error('getHotels failed', err);
    res.status(500).json({});
  }
}
