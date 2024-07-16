import { z } from "zod";
import { Plugin, ResourceBlock } from "../..";

export class Rctf extends Plugin {
  public readonly name = "rctf";
}

export class Challenge extends ResourceBlock {
  public key = "challenge";
  public schema = z.object({});

  @Plugin.needs(
    z.object({
      name: z.string(),
      author: z.string(),
      category: z.string(),
      description: z.string(),
      provides: z.array(z.string()),
    })
  )
  public pushToScoreboard() {}
}
