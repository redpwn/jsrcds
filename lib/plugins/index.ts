export abstract class ResourceBlock {
  public abstract key: string;
  public abstract getResourceSchema(): Zod.Schema<any>;
  public abstract getModelSchema(): Zod.Schema<any>;
  public abstract produceModel(): any;
}

export abstract class Plugin<PluginConfig> {
  public abstract readonly name: string;
  public config: PluginConfig;

  public abstract getResourceBlocks(): ResourceBlock[];

  static needs(schema: Zod.Schema<any>) {
    return (target: Function) => {
      // do something with the schema
      console.log(schema);
    };
  }

  constructor(config: PluginConfig) {
    this.config = config;
  }
}
