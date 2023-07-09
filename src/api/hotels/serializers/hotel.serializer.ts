import { Hotel } from '../interfaces/hotel.interface';

export function serializeHotel(hotel: Hotel) {
  return {
    id: hotel.id,
    destination_id: hotel.destination_id,
    name: hotel.name,
    location: {
      lat: hotel.location.lat,
      lng: hotel.location.lng,
      address: hotel.location.address,
      city: hotel.location.city,
      country: hotel.location.country,
    },
    description: hotel.description,
    amenities: {
      general: [...hotel.amenities.general],
      room: [...hotel.amenities.room],
    },
    images: {
      rooms: [...hotel.images.rooms],
      site: [...hotel.images.site],
      amenities: [...hotel.images.amenities],
    },
    booking_conditions: [...hotel.booking_conditions],
  };
}
