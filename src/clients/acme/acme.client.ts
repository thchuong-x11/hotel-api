import axios from 'axios';

import { Hotel } from '../../api/hotels/interfaces/hotel.interface';
import config from '../../config';
import { Logger } from '../../utils/logger';

import { AcmeHotel } from './interfaces/hotel.interface';
import { serializeAcmeHotelToHotel } from './serializers/acme-hotel-to-hotel.serializer';

export class AcmeClient {
  constructor(private readonly logger: Logger) {}

  async get(): Promise<Array<Hotel>> {
    try {
      const response = await axios.get<AcmeHotel[]>(config.suppliers.acme);
      return response.data.map((hotel) => serializeAcmeHotelToHotel(hotel));
    } catch (err) {
      this.logger.error('AcmeClient.get', err);
      return [];
    }
  }
}
