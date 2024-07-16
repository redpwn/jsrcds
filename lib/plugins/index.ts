import type { ResourceBlock } from "./resource";

export abstract class Plugin<PluginConfig> {
  public abstract readonly name: string;
  public config: PluginConfig;

  public abstract getResourceBlocks(): ResourceBlock[];

  constructor(config: PluginConfig) {
    this.config = config;
  }
}
