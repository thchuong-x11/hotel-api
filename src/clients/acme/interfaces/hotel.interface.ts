export interface AcmeHotel {
  Id: string;
  DestinationId: number;
  Name: string;
  Latitude: string | number | null;
  Longitude: string | number | null;
  Address: string;
  City: string;
  Country: string;
  PostalCode: string;
  Description: string;
  Facilities: ['Pool', 'BusinessCenter', 'WiFi ', 'DryCleaning', ' Breakfast'];
}
