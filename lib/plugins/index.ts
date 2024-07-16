export abstract class ResourceBlock {
  public abstract key: string;

  static needs(schema: Zod.ZodObject<any>) {
    return (
      target: Object,
      propertyKey: string | symbol,
      descriptor: PropertyDescriptor
    ) => {
      const originalMethod = descriptor.value;
      descriptor.value = function (...args: any[]) {
        console.log("woo decorator", propertyKey);
        const result = originalMethod.apply(this, args);
        return result;
      };

      return descriptor;
    };
  }
}

export abstract class Plugin<PluginConfig> {
  public abstract readonly name: string;
  public config: PluginConfig;

  public abstract getResourceBlocks(): ResourceBlock[];

  constructor(config: PluginConfig) {
    this.config = config;
  }
}
