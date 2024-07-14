import { Loader, type LoaderConfig } from "./loader";
import { Plugin } from "../plugins";

class ChallengeRegistry {
  private loader: Loader<LoaderConfig>;
  private plugins: Plugin[];

  constructor(loader: Loader<LoaderConfig>, plugins: Plugin[]) {
    this.loader = loader;
    this.plugins = plugins;
  }

  constructChallenge(resources: any[]) {}
}
class Challenge {
  // resource DAG

  initializeResourceBlocks() {}
}
