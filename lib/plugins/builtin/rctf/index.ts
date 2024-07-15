import { z } from "zod";
import { Plugin, ResourceBlockConfig } from "..";

export class Rctf extends Plugin {
  public readonly name = "rctf";

  public getChallengeConfigSchema() {
    return {};
  }
}

export class Challenge extends ResourceBlockConfig<any> {
  public key = "challenge";
  public schema = z.object({});
}
