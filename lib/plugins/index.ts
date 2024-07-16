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

  static needs(schema: Zod.ZodObject<any>) {
    return function (
      target: Object,
      propertyKey: string | symbol,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;
      descriptor.value = function (...args: any[]) {
        console.log("woo decorator");
        const result = originalMethod.apply(this, args);
        return result;
      };

      return descriptor;
    };
  }

  constructor(config: PluginConfig) {
    this.config = config;
  }
}
