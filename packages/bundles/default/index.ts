import { Bundle } from "rcds/bundle";

// import { TSLoader } from "@rcds/loader-tscfg";
import { ClassicLoader } from "@rcds/loader-classic";

import { LocalStorage } from "@rcds/provider-local/fs";
import { K8SCluster } from "@rcds/provider-k8s";

import { Containers } from "@rcds/plugin-containers";
import { Challenge } from "@rcds/plugin-challenge";

interface Config {
  repoRoot: string;
}

export class DefaultBundle extends Bundle<Config> {
  async getLoaders() {
    const storage = new LocalStorage(this.config.repoRoot);
    const containers = new Containers(storage);
    const cluster = new K8SCluster();
    const challenge = new Challenge(containers, cluster);

    return [new ClassicLoader({}, storage, challenge)];
  }

  async getPlugins() {
    return [];
  }
  async getProviders() {
    return [];
  }
}
