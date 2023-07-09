import isEqual from 'lodash.isequal';
import uniqWith from 'lodash.uniqwith';

import { Image } from '../interfaces/hotel.interface';

export function mergeHotelImages(left: Array<Image>, right: Array<Image>): Array<Image> {
  return uniqWith([...left, ...right], isEqual);
}
