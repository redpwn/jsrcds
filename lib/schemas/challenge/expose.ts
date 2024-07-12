import { z } from "zod";

import { domainSafeName } from "../utils";

const ExposeConfig = z
  .record(
    domainSafeName,
    z
      .array(
        z
          .object({
            target: z
              .number()
              .int()
              .describe("The port number on the container this rule targets."),
            tcp: z
              .number()
              .int()
              .optional()
              .describe(
                "The external port number to expose, treating this port as raw TCP."
              ),
            http: z
              .string()
              .optional()
              .describe("Hostname to expose this port as HTTP."),
            tls: z
              .union([
                z.string().describe("Hostname to expose this port as TLS."),
                z
                  .object({
                    hostname: z
                      .string()
                      .describe("Hostname to expose this port as TLS."),
                    alpn: z
                      .array(z.string())
                      .optional()
                      .describe(
                        "List of ALPN protocols to negotiate for this expose. Defaults to http/1.1 only."
                      ),
                    entrypoint: z
                      .enum(["tcp", "https"])
                      .optional()
                      .describe(
                        "Entrypoint to use for this expose. Defaults to the TCP entrypoint only. The entrypoint controls the externally listening port."
                      ),
                  })
                  .strict(),
              ])
              .optional(),
            healthContent: z
              .string()
              .min(1)
              .optional()
              .describe(
                "Content to expect when checking the health of this port. If not specified, the health check will only check if if the connection succeeds (for TCP) or if the server responds (for HTTP)."
              ),
            rateLimit: z
              .boolean()
              .optional()
              .describe(
                "Whether to apply an IP-based request rate limit to this expose. Supported for HTTP exposes only. Defaults to false."
              ),
          })
          .strict()
          .refine((data: any) => data.http || data.tcp || data.tls, {
            message: "Either http, tcp or tls must be provided",
          })
      )
      .optional()
  )
  .optional()
  .describe(
    "Ports on containers to expose to the Internet. Keys correspond to the key of the container that the rule is targeting."
  );

export default ExposeConfig;
