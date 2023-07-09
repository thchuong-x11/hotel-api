import mergeWith from 'lodash.mergewith';

import { AcmeClient } from '../../../clients/acme/acme.client';
import { PaperfilesClient } from '../../../clients/paperflies/paperfiles.client';
import { PatagoniaClient } from '../../../clients/patagonia/patagonia.client';
import { Logger } from '../../../utils/logger';
import { mergeString, mergeStringArrayKeepUnique } from '../../../utils/merge';
import { mergeHotelAmenities } from '../helpers/merge-hotel-amenities';
import { mergeHotelImages } from '../helpers/merge-hotel-images';
import { mergeHotelLocation } from '../helpers/merge-hotel-location';
import { GetHotelsInternalParams, GetHotelsParams } from '../interfaces/get-hotels-api.interface';
import { Hotel } from '../interfaces/hotel.interface';

export class GetHotelsService {
  private readonly logger: Logger;
  private readonly acmeClient: AcmeClient;
  private readonly paperfliesClient: PaperfilesClient;
  private readonly patagoniaClient: PatagoniaClient;

  constructor({
    logger,
    acmeClient,
    paperfliesClient,
    patagoniaClient,
  }: {
    logger: Logger;
    acmeClient?: AcmeClient;
    paperfliesClient?: PaperfilesClient;
    patagoniaClient?: PatagoniaClient;
  }) {
    this.logger = logger;
    this.acmeClient = acmeClient ?? new AcmeClient(logger);
    this.paperfliesClient = paperfliesClient ?? new PaperfilesClient(logger);
    this.patagoniaClient = patagoniaClient ?? new PatagoniaClient(logger);
  }

  async run(params: GetHotelsParams): Promise<Array<Hotel>> {
    try {
      const internalParams: GetHotelsInternalParams =
        'destination' in params
          ? { destination: params.destination }
          : 'hotels' in params
          ? { hotels: new Set(params.hotels) }
          : {};
      const [acmeHotelsRes, patagoniaHotelsRes, paperfliesHotelsRes] = await Promise.allSettled([
        this.acmeClient.get(internalParams),
        this.patagoniaClient.get(internalParams),
        this.paperfliesClient.get(internalParams),
      ]);

      return this.mergeHotelsInfos({
        acmeHotels: acmeHotelsRes.status === 'fulfilled' ? acmeHotelsRes.value : [],
        paperfliesHotels: paperfliesHotelsRes.status === 'fulfilled' ? paperfliesHotelsRes.value : [],
        patagoniaHotels: patagoniaHotelsRes.status === 'fulfilled' ? patagoniaHotelsRes.value : [],
      });
    } catch (err) {
      this.logger.error('GetHotelsService.run failed', err);
      return [];
    }
  }

  private mergeHotelsInfos({
    acmeHotels,
    patagoniaHotels,
    paperfliesHotels,
  }: {
    acmeHotels: Array<Hotel>;
    patagoniaHotels: Array<Hotel>;
    paperfliesHotels: Array<Hotel>;
  }): Array<Hotel> {
    const hotelsById = new Map<string, Hotel>();
    for (const acmeHotel of acmeHotels) {
      hotelsById.set(acmeHotel.id, acmeHotel);
    }

    for (const paperfliesHotel of paperfliesHotels) {
      const correspondingHotel = hotelsById.get(paperfliesHotel.id);
      hotelsById.set(
        paperfliesHotel.id,
        correspondingHotel ? this.mergeWithPaperfliesHotel(correspondingHotel, paperfliesHotel) : paperfliesHotel,
      );
    }

    for (const patagoniaHotel of patagoniaHotels) {
      const correspondingHotel = hotelsById.get(patagoniaHotel.id);
      hotelsById.set(
        patagoniaHotel.id,
        correspondingHotel ? this.mergeWithPatagoniaHotel(correspondingHotel, patagoniaHotel) : patagoniaHotel,
      );
    }

    return Array.from(hotelsById.values());
  }

  private mergeWithPaperfliesHotel(src: Hotel, paperfliesHotel: Hotel): Hotel {
    return mergeWith(src, paperfliesHotel, (objValue, srcValue, key: keyof Hotel) => {
      switch (key) {
        case 'description':
          return mergeString(srcValue, objValue, 'r');
        case 'booking_conditions':
          return mergeStringArrayKeepUnique(srcValue, objValue);
        case 'id':
        case 'destination_id':
          return srcValue;
        case 'name':
          return mergeString(srcValue, objValue);
        case 'location':
          return mergeHotelLocation(srcValue, objValue);
        case 'amenities':
          return {
            room: mergeHotelAmenities(srcValue.room, objValue.room),
            general: mergeHotelAmenities(srcValue.general, objValue.general),
          };
        case 'images':
          return {
            amenities: mergeHotelImages(srcValue.amenities, objValue.amenities),
            rooms: mergeHotelImages(srcValue.rooms, objValue.rooms),
            site: mergeHotelImages(srcValue.site, objValue.site),
          };

        default:
          return objValue;
      }
    });
  }

  private mergeWithPatagoniaHotel(src: Hotel, patagoniaHotel: Hotel): Hotel {
    return mergeWith(src, patagoniaHotel, (objValue, srcValue, key: keyof Hotel) => {
      switch (key) {
        case 'description':
          return mergeString(srcValue, objValue, 'l');
        case 'booking_conditions':
          return mergeStringArrayKeepUnique(srcValue, objValue);
        case 'id':
        case 'destination_id':
          return srcValue;
        case 'name':
          return mergeString(srcValue, objValue);
        case 'location':
          return mergeHotelLocation(srcValue, objValue);
        case 'amenities':
          return {
            room: mergeHotelAmenities(srcValue.room, objValue.room),
            general: mergeHotelAmenities(srcValue.general, objValue.general),
          };
        case 'images':
          return {
            amenities: mergeHotelImages(srcValue.amenities, objValue.amenities),
            rooms: mergeHotelImages(srcValue.rooms, objValue.rooms),
            site: mergeHotelImages(srcValue.site, objValue.site),
          };

        default:
          return objValue;
      }
    });
  }
}
