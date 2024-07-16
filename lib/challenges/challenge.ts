import { Loader, type LoaderConfig } from "./loader";
import { Plugin } from "../plugins";

export class ChallengeRegistry {
  private loader: Loader<LoaderConfig>;
  private plugins: Plugin<any>[];

  constructor(loader: Loader<LoaderConfig>, plugins: Plugin<any>[]) {
    this.loader = loader;
    this.plugins = plugins;
  }

  async loadChallenges() {
    const challenges = await this.loader.getChallenges();
    console.dir(challenges, { depth: null });
    this.constructChallenge(challenges);
  }

  constructChallenge(resources: any[]) {}
}
