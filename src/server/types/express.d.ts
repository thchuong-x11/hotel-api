import { GetHotelsService } from '../../api/hotels/services/get-hotels-service';
import { Logger } from '../../utils/logger';

export interface Ctx {
  logger: Logger;
  getHotelsService: GetHotelsService;
}

export interface RequestContext {
  ctx: Ctx;
}
