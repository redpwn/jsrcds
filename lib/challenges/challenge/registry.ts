import { Loader, type LoaderConfig } from "../loader";
import { Plugin } from "../../plugins";
import { createLoader } from "../loader/factory";

export class ChallengeRegistry {
  private loader: Loader<LoaderConfig>;

  constructor(loaderConfig: LoaderConfig, public plugins: Plugin<any>[]) {
    this.loader = createLoader(loaderConfig);
  }

  async loadChallenges() {
    const challenges = await this.loader.getChallenges();
    // console.dir(challenges, { depth: null });
    this.constructChallenge(challenges);
  }

  constructChallenge(resources: any[]) {}
}
