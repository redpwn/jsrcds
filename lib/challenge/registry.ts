import { Loader, type LoaderConfig } from "../loader";
import { Plugin } from "../plugins";

export class ChallengeRegistry {
  constructor(
    public loader: Loader<LoaderConfig>,
    public plugins: Plugin<any>[]
  ) {}

  async loadChallenges() {
    const challenges = await this.loader.getChallenges();
    console.dir(challenges, { depth: null });
    this.constructChallenge(challenges);
  }

  constructChallenge(resources: any[]) {}
}
