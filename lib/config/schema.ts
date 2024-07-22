import { z } from "zod";

export const configSchema = z.object({
  packagePath: z.string(),
  stackName: z.string().optional(),
  projectName: z.string().optional()
});
