export abstract class Plugin<PluginConfig> {
  public abstract readonly name: string;
  public config: PluginConfig;

  constructor(config: PluginConfig) {
    this.config = config;
  }
}
