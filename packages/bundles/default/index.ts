import { Bundle } from "rcds/bundle";

// import { TSLoader } from "@rcds/loader-tscfg";
import { ClassicLoader } from "@rcds/loader-classic";

import { LocalStorage } from "@rcds/provider-local/fs";
import { Containers } from "@rcds/plugin-containers";

interface Config {
  repoRoot: string;
}

export class DefaultBundle extends Bundle<Config> {
  async getLoaders() {
    const storage = new LocalStorage(this.config.repoRoot);
    const containers = new Containers(storage);

    return [new ClassicLoader({}, storage, containers)];
  }

  async getPlugins() {
    return [];
  }
  async getProviders() {
    return [];
  }
}
