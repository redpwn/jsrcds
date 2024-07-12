import { z } from "zod";

export const domainSafeName = z
  .string()
  .regex(/^[a-z0-9]([a-z0-9-]{0,48}[a-z0-9])?$/);
export const cpuValue = z.union([z.string().regex(/^[0-9]+m$/), z.number()]);
export const memoryValue = z.union([
  z.string().regex(/^[0-9]+[KMGTE]i?$/),
  z.number(),
]);
