class Resource {
  public dependencies: Dependency[] = [];

  constructor(public id: string, public name: string) {}
}

class Dependency {
  public pluginName: string;
  public modelPath: string;

  constructor(public id: string, public name: string) {
    this.pluginName = id;
    this.modelPath = name;
  }
}
