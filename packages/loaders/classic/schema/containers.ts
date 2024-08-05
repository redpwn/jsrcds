import { z } from "zod";

import { domainSafeName, cpuValue, memoryValue } from "./utils";

export const ContainerConfig = z
  .record(
    domainSafeName,
    z
      .object({
        image: z
          .string()
          .optional()
          .describe(
            "The image tag for this container. If 'build' is not specified, the container will be pulled (e.g. containers for services like a database found on dockerhub). If 'build' is specified, this overrides the 'name' (default the name of the directory specified in 'build') in the image tag template defined globally in the project."
          ),
        build: z
          .union([
            z
              .string()
              .describe(
                "Path to the directory containing a Dockerfile to build for this container."
              ),
            z
              .object({
                context: z.string().describe("Path to the build context"),
                dockerfile: z
                  .string()
                  .default("Dockerfile")
                  .describe("Path to the Dockerfile within the build context"),
                args: z
                  .record(z.string(), z.string().optional())
                  .optional()
                  .describe(
                    "Build arguments to be passed to the build. Please write numbers as strings to avoid ambiguity from number formatting"
                  ),
              })
              .strict(),
          ])
          .optional(),
        replicas: z
          .number()
          .int()
          .gte(1)
          .default(1)
          .describe(
            "Number of replicas of this container to run. Set to 1 for stateful applications. Default 1. Unsupported when instancer is enabled."
          ),
        environment: z
          .record(z.string(), z.string())
          .optional()
          .describe(
            "Environment variables to set within the container. Please format all values as strings. Keys without values are not supported."
          ),
        ports: z
          .array(z.number().int())
          .optional()
          .describe(
            "Port numbers (as integers) on this container to expose to other containers within this challenge. If a port is supposed to be exposed to the Internet, make sure it is specified here, and add it to the top level 'expose' key."
          ),
        securityContext: z
          .object({
            privileged: z
              .boolean()
              .describe(
                "Whether or not this container should be run in privileged mode."
              ),
          })
          .strict()
          .optional(),
        resources: z
          .object({
            limits: z
              .object({
                cpu: cpuValue.describe(
                  "CPU usage limits for this container - 1 unit corresponds to 1 CPU second per (wall-clock) second."
                ),
                memory: memoryValue.describe(
                  "Memory usage limits for this container."
                ),
              })
              .strict(),
            requests: z
              .object({
                cpu: cpuValue.describe(
                  "CPU usage requests for this container - 1 unit corresponds to 1 CPU second per (wall-clock) second."
                ),
                memory: memoryValue.describe(
                  "Memory usage requests for this container."
                ),
              })
              .strict(),
          })
          .strict()
          .refine((data) => data.limits && data.requests, {
            message: "Both limits and requests must be provided",
          }),
      })
      .strict()
      .refine((data) => data.image || data.build, {
        message: "Either image or build must be provided",
      })
  )
  .optional()
  .describe(
    "Containers to be deployed for this challenge. The key of each container is its name, where the container can be found via DNS lookup at runtime from other containers within this challenge."
  );
