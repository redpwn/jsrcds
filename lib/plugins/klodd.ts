// TEMPLATING

// if (challenge.instancer) {
//     // klodd challenges only have one expose
//     const kloddId = (exposes[0].http ?? exposes[0].tls.hostname).slice(
//       0,
//       -rootConfig.challengeHost.length - 1
//     );
//     model.instancer = `https://instancer.${rootConfig.challengeHost}/challenge/${kloddId}`;
//   }

// SCHEMA

// instancer: z
// .object({
//   name: z
//     .string()
//     .optional()
//     .describe(
//       "Name of the challenge in the instancer. Defaults to challenge name."
//     ),
//   timeout: z
//     .number()
//     .int()
//     .min(0)
//     .describe(
//       "Timeout in milliseconds for the lifetime of each instance."
//     ),
// })
// .strict()
// .optional()
// .describe(
//   "Configuration for the instancer service, which can create challenges for competitors on demand."
// ),
