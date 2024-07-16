export abstract class ResourceBlockConfig {
  public abstract key: string;
  public abstract getResourceSchema(): Zod.Schema<any>;
  public abstract getModelSchema(): Zod.Schema<any>;
}

export abstract class Plugin<PluginConfig> {
  public abstract readonly name: string;
  public config: PluginConfig;

  public abstract getResourceBlocks(): ResourceBlockConfig[];

  constructor(config: PluginConfig) {
    this.config = config;
  }
}
