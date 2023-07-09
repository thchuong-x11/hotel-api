import axios from 'axios';

import { Hotel } from '../../api/hotels/interfaces/hotel.interface';
import config from '../../config';
import { Logger } from '../../utils/logger';

import { PaperfliesHotel } from './interfaces/hotel.interface';
import { serializePaperfliesHotelToHotel } from './serializers/paperfiles-hotel-to-hotel.serializer';

export class PaperfilesClient {
  constructor(private readonly logger: Logger) {}

  async get(): Promise<Array<Hotel>> {
    try {
      const response = await axios.get<PaperfliesHotel[]>(config.suppliers.paperflies);
      return response.data.map((hotel) => serializePaperfliesHotelToHotel(hotel));
    } catch (err) {
      this.logger.error('PaperfilesClient.get', err);
      return [];
    }
  }
}
