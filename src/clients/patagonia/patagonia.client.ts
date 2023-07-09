import axios from 'axios';

import { Hotel } from '../../api/hotels/interfaces/hotel.interface';
import config from '../../config';
import { Logger } from '../../utils/logger';

import { PatagoniaHotel } from './interfaces/hotel.interface';
import { serializePatagoniaHotelToHotel } from './serializers/patagonia-hotel-to-hotel.serializer';

export class PatagoniaClient {
  constructor(private readonly logger: Logger) {}

  async get(): Promise<Array<Hotel>> {
    try {
      const response = await axios.get<PatagoniaHotel[]>(config.suppliers.patagonia);
      return response.data.map((hotel) => serializePatagoniaHotelToHotel(hotel));
    } catch (err) {
      this.logger.error('PatagoniaClient.get', err);
      return [];
    }
  }
}
