import { z } from "zod";

export const TogglePeriod = z.object({
  id: z.string(),
  isActive: z.boolean(),
});
