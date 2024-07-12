import { z } from "zod";
import { domainSafeName } from "../utils";
import containerConfigSchema from "./container";
import exposeConfigSchema from "./expose";

export const challengeConfigSchema = z
  .object({
    id: domainSafeName
      .optional()
      .describe(
        "Override the automatically generated id for this challenge. You should avoid setting this whenever possible."
      ),
    segment: z
      .string()
      .optional()
      .describe("Path of this challenge from the challenge repository root."),
    name: z.string().describe("The name of the challenge"),
    author: z
      .union([z.string(), z.array(z.string())])
      .describe("The author(s) of the challenge"),
    description: z
      .string()
      .describe(
        "Description of the challenge. It is in Markdown format and will be processed with Handlebars."
      ),
    category: z
      .string()
      .optional()
      .describe(
        "Category of the challenge. If not provided, defaults to the parent directory of the challenge (e.g. if this file is located at /pwn/chall1/challenge.yaml, the category will default to 'pwn')."
      ),
    tiebreakEligible: z
      .boolean()
      .optional()
      .describe(
        "Whether or not this challenge is eligible for tiebreakers. This is generally only used for challenges that are not worth full points."
      ),
    sortWeight: z
      .number()
      .int()
      .optional()
      .describe(
        "The weight to use when sorting challenges. This is used to sort challenges within a category."
      ),
    flag: z
      .union([
        z.string(),
        z
          .object({
            file: z
              .string()
              .describe(
                "File to load the flag from. The file should contain one line with only the flag."
              ),
          })
          .strict(),
      ])
      .describe("The flag for the challenge."),
    value: z
      .union([
        z.number().int().min(0),
        z
          .object({
            min: z.number().int().min(0),
            max: z.number().int().min(0),
          })
          .strict()
          .refine((data) => data.min <= data.max, {
            message: "min must be less than or equal to max",
          }),
      ])
      .describe(
        "The point value of the challenge. Static if set to an integer, dynamic if min and max are provided. Defaults to dynamic with competition min and max values."
      ),
    visible: z
      .boolean()
      .optional()
      .describe(
        "Whether or not this challenge should be shown on the scoreboard. Default true."
      ),
    provide: z
      .array(
        z.union([
          z.string().describe("Path to the file to provide"),
          z
            .object({
              url: z
                .string()
                .regex(/^https?:\/\//)
                .optional()
                .describe("URL to download the file from"),
              file: z
                .string()
                .optional()
                .describe("Path to the file to provide"),
              as: z
                .string()
                .optional()
                .describe("Name of file as shown to competitors"),
            })
            .strict()
            .refine((data: any) => data.url || data.file, {
              message: "Either url or file must be provided",
            }),
        ])
      )
      .optional()
      .describe("Static files to provide to competitors"),
    deployed: z
      .boolean()
      .optional()
      .describe(
        "Whether or not this challenge's containers should be deployed. Default true."
      ),
    containers: containerConfigSchema,
    expose: exposeConfigSchema,
  })
  .strict();

// it's not really an interface but i dont want to deal with the duplicate name
export type ChallengeConfig = z.infer<typeof challengeConfigSchema>;
