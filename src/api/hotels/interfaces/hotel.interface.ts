export interface Image {
  link: string;
  description: string;
}

export interface Hotel {
  id: string;
  destination_id: number;
  name: string;
  location: {
    lat: number | null;
    lng: number | null;
    address: string;
    city: string;
    country: string;
  };
  description: string;
  amenities: {
    general: string[];
    room: string[];
  };
  images: {
    rooms: Image[];
    site: Image[];
    amenities: Image[];
  };
  booking_conditions: string[];
}
