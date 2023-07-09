export interface PatagoniaImage {
  url: string;
  description: string;
}

export interface PatagoniaHotel {
  id: string;
  destination: number;
  name: string;
  lat: number;
  lng: number;
  address: string | null;
  info: string | null;
  amenities: string[] | null;
  images: {
    rooms: PatagoniaImage[];
    amenities: PatagoniaImage[];
  };
}
