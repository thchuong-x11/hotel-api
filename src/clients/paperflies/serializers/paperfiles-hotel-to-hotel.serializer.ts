import { Hotel } from '../../../api/hotels/interfaces/hotel.interface';
import { PaperfliesHotel } from '../interfaces/hotel.interface';

export function serializePaperfliesHotelToHotel(paperfilesHotel: PaperfliesHotel): Hotel {
  return {
    id: paperfilesHotel.hotel_id,
    destination_id: paperfilesHotel.destination_id,
    name: paperfilesHotel.hotel_name.trim(),
    description: paperfilesHotel.details.trim(),
    location: {
      lat: null,
      lng: null,
      address: paperfilesHotel.location.address.trim(),
      city: '',
      country: paperfilesHotel.location.country,
    },
    amenities: {
      general: paperfilesHotel.amenities.general.map((amenity) => amenity.trim().toLowerCase()).filter((v) => v),
      room: paperfilesHotel.amenities.room.map((r) => r.trim().toLowerCase()).filter((v) => v),
    },
    images: {
      rooms: paperfilesHotel.images.rooms.map((room) => ({ link: room.link, description: room.caption.trim() })),
      site: paperfilesHotel.images.site.map((s) => ({ link: s.link, description: s.caption.trim() })),
      amenities: [],
    },
    booking_conditions: paperfilesHotel.booking_conditions.map((condition) => condition.trim()).filter((v) => v),
  };
}
