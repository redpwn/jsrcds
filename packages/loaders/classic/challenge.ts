import { ChallengePlugin } from "@rcds/plugin-challenge";
import type { ChallengeConfig } from "./schema";

export class Challenge {
  constructor(config: ChallengeConfig, private challenge: ChallengePlugin) {
    this.challenge.createChallenge(config);
  }
}
