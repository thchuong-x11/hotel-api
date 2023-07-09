import mergeWith from 'lodash.mergewith';

import { mergeStringArrayKeepUnique } from '../../../utils/merge';
import { Hotel } from '../interfaces/hotel.interface';

export function mergeHotelAmenities(
  amenitiesA: Hotel['amenities'],
  amenitiesB: Hotel['amenities'],
): Hotel['amenities'] {
  return mergeWith(amenitiesA, amenitiesB, (objValue, srcValue, key: keyof Hotel['amenities']) => {
    switch (key) {
      case 'room':
      case 'general':
        return mergeStringArrayKeepUnique(srcValue, objValue);
    }

    return objValue;
  });
}
