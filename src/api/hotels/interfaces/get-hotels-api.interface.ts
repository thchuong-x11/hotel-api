import { z } from 'zod';

export const GetHotelsSchema = z.union([
  z.strictObject({
    hotels: z.array(z.string()).min(1),
  }),
  z.strictObject({
    destination: z.coerce.number().positive(),
  }),
  z.strictObject({}),
]);

export type GetHotelsParams = z.infer<typeof GetHotelsSchema>;
export interface GetHotelsInternalParams {
  destination?: number;
  hotels?: Set<string>;
}
