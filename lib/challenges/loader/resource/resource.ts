type AnyObject = Record<string, any> | any[];

export class Resource {
  public dependencies: Dependency[] = [];

  createPossibleDependency(definition: any): any {
    // if is of type string and contains the ${} syntax
    if (typeof definition === "string" && definition.includes("${")) {
      const regex = /\${(.*?)}/g;
      const matches = definition.match(regex);
      if (matches) {
        matches.forEach((match) => {
          const dependency = match.replace("${", "").replace("}", "");
          this.dependencies.push(new Dependency("plugin", dependency));
        });
      }
    }
  }

  findDependencies(definition: AnyObject): any {
    if (Array.isArray(definition)) {
      return definition.map((item) => this.findDependencies(item));
    } else if (definition instanceof Object) {
      return Object.keys(definition).map((key) =>
        this.findDependencies(definition[key]),
      );
    } else {
      this.createPossibleDependency(definition);
    }
  }

  constructor(plugin: any, definition: Record<string, any>) {
    this.findDependencies(definition);
  }
}

class Dependency {
  constructor(
    public id: string,
    public name: string,
  ) {}
}
