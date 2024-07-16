import { z } from "zod";
import { Plugin } from "../../";
import { ResourceBlock } from "../../resource";

export class Rctf extends Plugin<any> {
  public readonly name = "rctf";

  public override getResourceBlocks(): ResourceBlock[] {
    return [new Challenge()];
  }
}

export class Challenge extends ResourceBlock {
  public key = "challenge";

  @ResourceBlock.needs(
    z.object({
      name: z.string(),
      author: z.string(),
      category: z.string(),
      description: z.string(),
      provides: z.array(z.string()),
    })
  )
  @ResourceBlock.provides(
    z.object({
      idk: z.string(),
    })
  )
  public pushToScoreboard() {}
}
