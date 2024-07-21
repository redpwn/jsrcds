import { ComponentResource, ComponentResourceOptions } from "@pulumi/pulumi";

export abstract class Plugin<PluginConfig> extends ComponentResource {
  public config: PluginConfig;

  constructor(name: string, opts: ComponentResourceOptions) {
    super("rcds:plugin:MyComponent", name, {}, opts);
    this.config = config;
  }
}

const plugin = (name: string) => {
  return (target, context) => {
    if (context.kind === "class") {
      return class extends target {
        fuel: number = 50;
        isEmpty(): boolean {
          return this.fuel == 0;
        }
      };
    }
  };
};
