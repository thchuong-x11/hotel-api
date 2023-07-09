import axios from 'axios';

import { GetHotelsInternalParams } from '../../api/hotels/interfaces/get-hotels-api.interface';
import { Hotel } from '../../api/hotels/interfaces/hotel.interface';
import config from '../../config';
import { Logger } from '../../utils/logger';

import { PatagoniaHotel } from './interfaces/hotel.interface';
import { serializePatagoniaHotelToHotel } from './serializers/patagonia-hotel-to-hotel.serializer';

export class PatagoniaClient {
  constructor(private readonly logger: Logger) {}

  async get(params: GetHotelsInternalParams): Promise<Array<Hotel>> {
    try {
      const response = await axios.get<PatagoniaHotel[]>(config.suppliers.patagonia);
      return response.data
        .filter((hotel) => this.filterHotel(params, hotel))
        .map((hotel) => serializePatagoniaHotelToHotel(hotel));
    } catch (err) {
      this.logger.error('PatagoniaClient.get', err);
      return [];
    }
  }

  private filterHotel(filterParams: GetHotelsInternalParams, hotel: PatagoniaHotel): boolean {
    if (filterParams.destination) {
      return filterParams.destination === hotel.destination;
    }

    if (filterParams.hotels) {
      return filterParams.hotels.size === 0 || filterParams.hotels.has(hotel.id);
    }

    return true;
  }
}
