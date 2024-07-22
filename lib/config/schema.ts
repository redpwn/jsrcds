import { z } from "zod";

export const configSchema = z.object({
  packagePath: z.string(),
  deploymentConfig: z.object({
    stackName: z.string().optional(),
    projectName: z.string().optional()
  })
});
