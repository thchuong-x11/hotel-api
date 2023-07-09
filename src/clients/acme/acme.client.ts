import axios from 'axios';

import { GetHotelsInternalParams } from '../../api/hotels/interfaces/get-hotels-api.interface';
import { Hotel } from '../../api/hotels/interfaces/hotel.interface';
import config from '../../config';
import { Logger } from '../../utils/logger';

import { AcmeHotel } from './interfaces/hotel.interface';
import { serializeAcmeHotelToHotel } from './serializers/acme-hotel-to-hotel.serializer';

export class AcmeClient {
  constructor(private readonly logger: Logger) {}

  async get(params: GetHotelsInternalParams): Promise<Array<Hotel>> {
    try {
      const response = await axios.get<AcmeHotel[]>(config.suppliers.acme);
      return response.data
        .filter((hotel) => this.filterHotel(params, hotel))
        .map((hotel) => serializeAcmeHotelToHotel(hotel));
    } catch (err) {
      this.logger.error('AcmeClient.get', err);
      return [];
    }
  }

  private filterHotel(filterParams: GetHotelsInternalParams, hotel: AcmeHotel): boolean {
    if (filterParams.destination) {
      return filterParams.destination === hotel.DestinationId;
    }

    if (filterParams.hotels) {
      return filterParams.hotels.size === 0 || filterParams.hotels.has(hotel.Id);
    }

    return true;
  }
}
