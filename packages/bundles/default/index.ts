import { Bundle } from "rcds/bundle";

import { TSLoader } from "@rcds/loader-tscfg";
import { ClassicLoader } from "@rcds/loader-classic";

import { LocalStorage } from "@rcds/provider-local/fs";

interface Config {
  repoRoot: string;
}

export class DefaultBundle extends Bundle<Config, any, any, any> {
  async getLoaders() {
    const storage = new LocalStorage(this.config.repoRoot);

    return [new ClassicLoader({}, storage)];
  }
  async getPlugins() {
    return [];
  }
  async getProviders() {
    return [];
  }
}
