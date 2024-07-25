import { Loader } from "rcds/loader";
import { Plugin } from "rcds/plugin";

export abstract class Bundle<T, LoaderConfig, PluginConfig, ProviderConfig> {
  constructor(protected config: T) {}

  abstract getLoaders(): Loader<LoaderConfig>[];
  abstract getPlugins(): Plugin<PluginConfig>[];
  abstract getProviders(): Loader<ProviderConfig>[];
}
