export interface PaperfilesImage {
  link: string;
  caption: string;
}

export interface PaperfliesHotel {
  hotel_id: string;
  destination_id: number;
  hotel_name: string;
  location: {
    address: string;
    country: string;
  };
  details: string;
  amenities: {
    general: ['outdoor pool', 'indoor pool', 'business center', 'childcare'];
    room: ['tv', 'coffee machine', 'kettle', 'hair dryer', 'iron'];
  };
  images: {
    rooms: PaperfilesImage[];
    site: PaperfilesImage[];
  };
  booking_conditions: string[];
}
