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

/**
 * Improvement notes:
 *
 * 1- Caching the data from suppliers
 * One easy improvement is to store the data from suppliers to reduce the loading time at each request.
 * Plus this will externalize the data normalization outside the endpoint.
 * Depending on how frequent the suppliers change their data, and with which mechanism they can provide us
 * to listen to the update (push, fetch endpoints with timestamp checkpoint, etag, etc.), we can update the internal
 * storage accordingly by performing a periodically update batch run.
 *
 * 2- Filtering
 * If we can have our own version of hotel data proposed by point 1, there is nothing much that we can do to improve the
 * filtering other than properly configuring the index of the database, partitioning the database based on the endpoint usage
 * If it is not the case, we need to consider delegating the filtering to the supplier endpoints whenever it is possible.
 * Otherwise, we'll have to query all the available entries from supplier endpoint and still maintaining some sort of transient
 * version of all the supplier data just to perform the filtering procedure.
 * We may also need to consider support more way to filter: by Geo (country or city), by name, by amenities available, etc.
 *
 * 3- Pagination or streaming
 * It is not possible to deliver all the available results in one simple request because the results could yield 90% or more
 * of the available data of any supplier - this, in turn, may cause huge memory consumption and long waiting time; any of which
 * can easily render negative user experience, not to mention the risks of having the request timeout or cancelled.
 * The remedy is to deliver the results by batch, either using pagination or streaming - the choice depends certainly
 * on whether we can have an internal database (then pagination is possible and easy to do) or we have to completely rely on
 * suppliers' database (then pagination is not as easy to implement as streaming)
 *
 * 4- Merging and normalizing data
 * For some data, in particular, booking-conditions and description we may need to really combine the data provided by
 * multiple suppliers to have a rich and useful information for the end-user. We may consider using generative AI like
 * Chat GPT or Bard AI to help with this job.
 */
