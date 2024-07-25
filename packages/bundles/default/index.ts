import { Bundle } from "rcds/bundle";

import { TSFileLoader } from "@rcds/loader-tscfg";

interface Config {
  repoRoot: string;
}

export class DefaultBundle extends Bundle<Config, any, any, any> {
  async getLoaders() {
    return [
      new TSFileLoader({
        repoRoot: this.config.repoRoot,
        model: {},
      }),
    ];
  }
  async getPlugins() {
    return [];
  }
  async getProviders() {
    return [];
  }
}
