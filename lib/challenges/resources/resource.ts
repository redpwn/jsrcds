export class Resource {
  public dependencies: Dependency[] = [];

  identifyDependencies() {}

  constructor(plugin: any, definition: Record<string, any>) {
    console.log(plugin, definition);
  }
}

class Dependency {
  public pluginName: string;
  public modelPath: string;

  constructor(public id: string, public name: string) {
    this.pluginName = id;
    this.modelPath = name;
  }
}
