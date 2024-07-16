import { Loader, type LoaderConfig } from "./loader";
import { Plugin } from "../plugins";
import { Hydrator } from "./hydrator";

export class ChallengeRegistry {
  private hydrator: Hydrator;

  constructor(
    public loader: Loader<LoaderConfig>,
    public plugins: Plugin<any>[]
  ) {
    this.hydrator = new Hydrator(plugins);
  }

  async loadChallenges() {
    const challenges = await this.loader.getChallenges();
    console.dir(challenges, { depth: null });
    this.constructChallenge(challenges);
  }

  constructChallenge(resources: any[]) {}
}
