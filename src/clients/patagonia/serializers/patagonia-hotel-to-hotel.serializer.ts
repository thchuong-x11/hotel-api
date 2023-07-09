import { Hotel } from '../../../api/hotels/interfaces/hotel.interface';
import { PatagoniaHotel } from '../interfaces/hotel.interface';

export function serializePatagoniaHotelToHotel(patagoniaHotel: PatagoniaHotel): Hotel {
  return {
    id: patagoniaHotel.id,
    destination_id: patagoniaHotel.destination,
    name: patagoniaHotel.name.trim(),
    description: patagoniaHotel.info?.trim() ?? '',
    location: {
      lat: patagoniaHotel.lat,
      lng: patagoniaHotel.lng,
      address: patagoniaHotel.address?.trim() ?? '',
      city: '',
      country: '',
    },
    amenities: {
      room: [],
      general: patagoniaHotel.amenities?.map((amenity) => amenity.trim().toLowerCase()) ?? [],
    },
    booking_conditions: [],
    images: {
      rooms: patagoniaHotel.images.rooms.map((room) => ({ link: room.url, description: room.description.trim() })),
      amenities: patagoniaHotel.images.amenities.map((amenity) => ({
        link: amenity.url,
        description: amenity.description.trim(),
      })),
      site: [],
    },
  };
}
