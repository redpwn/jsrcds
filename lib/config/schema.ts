import { z } from "zod";

export const configSchema = z.object({
  packagePath: z.string(),
});
