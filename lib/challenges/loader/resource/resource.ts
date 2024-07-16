type AnyObject = Record<string, any> | any[];

export class Resource {
  public dependencies: Dependency[] = [];

  createPossibleDependency(definition: any): any {
    // if is of type string and contains the ${} syntax
    if (typeof definition === "string" && definition.includes("${")) {
      const regex = /\${(.*?)}/g;
      const matches = definition.match(regex);
    }
    return definition;
  }

  findDependencies(definition: AnyObject): any {
    if (Array.isArray(definition)) {
      return definition.map((item) => this.findDependencies(item));
    } else if (definition instanceof Object) {
      return Object.fromEntries(
        Object.keys(definition).map((key) => [
          key,
          this.findDependencies(definition[key]),
        ])
      );
    } else {
      return this.createPossibleDependency(definition);
    }
  }

  constructor(plugin: any, definition: Record<string, any>) {
    console.log(this.findDependencies(definition));
  }
}

class Dependency {
  constructor(public id: string, public name: string) {}
}
