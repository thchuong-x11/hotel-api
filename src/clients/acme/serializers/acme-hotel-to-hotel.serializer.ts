import { Hotel } from '../../../api/hotels/interfaces/hotel.interface';
import { tryParseNumber } from '../../../utils/try-parse-number';
import { AcmeHotel } from '../interfaces/hotel.interface';

export function serializeAcmeHotelToHotel(acmeHotel: AcmeHotel): Hotel {
  return {
    id: acmeHotel.Id,
    destination_id: acmeHotel.DestinationId,
    name: acmeHotel.Name.trim(),
    description: acmeHotel.Description.trim(),
    location: {
      lat: tryParseNumber(acmeHotel.Latitude, null),
      lng: tryParseNumber(acmeHotel.Longitude, null),
      address: `${acmeHotel.Address.trim()} ${acmeHotel.PostalCode.trim()}`,
      city: acmeHotel.City.trim(),
      country: acmeHotel.Country.trim(),
    },
    amenities: {
      general: acmeHotel.Facilities.map((facility) => facility.trim().toLowerCase()),
      room: [],
    },
    booking_conditions: [],
    images: {
      amenities: [],
      rooms: [],
      site: [],
    },
  };
}
