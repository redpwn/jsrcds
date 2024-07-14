import { z } from "zod";
import { domainSafeName } from "../../../../utils";

import path from "path";

import type { Loader, LoaderConfig } from "../../../loader";

export const createChallengeConfigSchema = (
  loader: Loader<LoaderConfig>,
  segment: string
) =>
  z
    .object({
      id: domainSafeName
        .default(segment.toLowerCase().replaceAll("/", "-"))
        .describe(
          "Override the automatically generated id for this challenge. You should avoid setting this whenever possible."
        ),
      name: z.string().describe("The name of the challenge"),
      author: z
        .union([
          z.string(),
          z.array(z.string()).transform((authors) => authors.join(", ")),
        ])
        .describe("The author(s) of the challenge"),
      description: z
        .string()
        .describe(
          "Description of the challenge. It is in Markdown format and will be processed with Handlebars."
        ),
      category: z
        .string()
        .default(path.posix.dirname(segment))
        .describe(
          "Category of the challenge. If not provided, defaults to the parent directory of the challenge (e.g. if this file is located at /pwn/chall1/challenge.yaml, the category will default to 'pwn')."
        ),
      tiebreakEligible: z
        .boolean()
        .default(true)
        .describe(
          "Whether or not this challenge is eligible for tiebreakers. This is generally only used for challenges that are not worth full points."
        ),
      sortWeight: z
        .number()
        .int()
        .default(0)
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
            .transform(async ({ file }) => loader.getResource(segment, file)),
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
        .default(true)
        .describe(
          "Whether or not this challenge should be shown on the scoreboard. Default true."
        ),
      deployed: z
        .boolean()
        .default(true)
        .describe(
          "Whether or not this challenge's containers should be deployed. Default true."
        ),
      plugins: z
        .any()
        .default([])
        .describe("List of challenge plugins to use."),
    })
    .strict();

export type ChallengeConfig = z.infer<
  ReturnType<typeof createChallengeConfigSchema>
>;
