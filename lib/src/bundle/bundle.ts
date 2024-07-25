import { Loader } from "rcds/loader";
import { Plugin } from "rcds/plugin";

export abstract class Bundle<T, LoaderConfig, PluginConfig, ProviderConfig> {
  constructor(protected config: T) {}

  abstract getLoaders(): Promise<Loader<LoaderConfig>[]>;
  abstract getPlugins(): Promise<Plugin<PluginConfig>[]>;
  abstract getProviders(): Promise<Loader<ProviderConfig>[]>;
}
