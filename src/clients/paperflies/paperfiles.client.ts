import axios from 'axios';

import { GetHotelsInternalParams } from '../../api/hotels/interfaces/get-hotels-api.interface';
import { Hotel } from '../../api/hotels/interfaces/hotel.interface';
import config from '../../config';
import { Logger } from '../../utils/logger';

import { PaperfliesHotel } from './interfaces/hotel.interface';
import { serializePaperfliesHotelToHotel } from './serializers/paperfiles-hotel-to-hotel.serializer';

export class PaperfilesClient {
  constructor(private readonly logger: Logger) {}

  async get(params: GetHotelsInternalParams): Promise<Array<Hotel>> {
    try {
      const response = await axios.get<PaperfliesHotel[]>(config.suppliers.paperflies);
      return response.data
        .filter((hotel) => this.filterHotel(params, hotel))
        .map((hotel) => serializePaperfliesHotelToHotel(hotel));
    } catch (err) {
      this.logger.error('PaperfilesClient.get', err);
      return [];
    }
  }

  private filterHotel(filterParams: GetHotelsInternalParams, hotel: PaperfliesHotel): boolean {
    if (filterParams.destination) {
      return filterParams.destination === hotel.destination_id;
    }

    if (filterParams.hotels) {
      return filterParams.hotels.size === 0 || filterParams.hotels.has(hotel.hotel_id);
    }

    return true;
  }
}
