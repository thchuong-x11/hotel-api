import mergeWith from 'lodash.mergewith';

import { mergeNumber, mergeString } from '../../../utils/merge';
import { Hotel } from '../interfaces/hotel.interface';

export function mergeHotelLocation(locationA: Hotel['location'], locationB: Hotel['location']): Hotel['location'] {
  return mergeWith(locationA, locationB, (objValue, srcValue, key: keyof Hotel['location']) => {
    switch (key) {
      case 'lat':
      case 'lng':
        return mergeNumber(srcValue, objValue);
      case 'address':
      case 'city':
      case 'country':
        return mergeString(srcValue, objValue, srcValue.length > objValue.length ? 'l' : 'r');
    }

    return objValue;
  });
}
