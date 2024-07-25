import { Loader } from "rcds/loader";
import { Plugin } from "rcds/plugin";

import { Deployment } from "rcds/deployment";

export abstract class Bundle<T, LoaderConfig, PluginConfig, ProviderConfig> {
  constructor(protected config: T) {}

  abstract getLoaders(): Promise<Loader<LoaderConfig>[]>;
  abstract getPlugins(): Promise<Plugin<PluginConfig>[]>;
  abstract getProviders(): Promise<Loader<ProviderConfig>[]>;

  async deployChallenges() {
    const loaders = await this.getLoaders();
    const plugins = await this.getPlugins();
    const providers = await this.getProviders();

    for (const loader of loaders) {
      // assuming there's one loader right now
      const prog = await loader.getChallenges();
      if (!prog) {
        throw new Error("No challenges found");
      }
      const deployment = new Deployment({
        projectName: "rcds",
        stackName: "dev",
        accessToken: process.env.PULUMI_ACCESS_TOKEN,
      });
      const stack = await deployment.createStack(prog);
      await stack.up({ onOutput: console.info });
    }
  }
}
