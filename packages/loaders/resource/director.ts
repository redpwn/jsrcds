import { ResourceBuilder } from "../../resources";

export class ResourceDirector {
  private builder: ResourceBuilder = new ResourceBuilder();

  createPossibleDependency(definition: any): any {
    // if is of type string and contains the ${} syntax
    if (typeof definition === "string" && definition.includes("${")) {
      const regex = /\${(.*?)}/g;
      const matches = definition.match(regex);
      this.dependencies.push(
        ...matches!.map((match) => {
          return new Dependency(match);
        })
      );
      return (dependency: any) => {};
    }
    return definition;
  }

  findDependencies(definition: any): any {
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

  constructor(resourceName: string, definition: Record<string, any>) {
    console.log(this.findDependencies(definition));
  }
}
