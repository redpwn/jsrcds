import { Loader } from "../loader";
import { Plugin } from "../../plugins";
import { createLoader } from "../../../bin/factory";

export class ChallengeRegistry {
  private loader: Loader<unknown>;

  constructor(loaderConfig: unknown, public plugins: Plugin<any>[]) {
    this.loader = createLoader(loaderConfig);
  }

  async loadChallenges() {
    const challenges = await this.loader.getChallenges();
    // console.dir(challenges, { depth: null });
    this.constructChallenge(challenges);
  }

  constructChallenge(resources: any[]) {}
}
