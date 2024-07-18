import { ChallengeBuilder } from "@rcds/challenge";

const dependencyRegex = /\${(.*?)}/g;
export class ChallengeDirector {
  private builder: ChallengeBuilder = new ChallengeBuilder();

  createPossibleDependency(definition: any): any {
    // if is of type string and contains the ${} syntax
    if (typeof definition === "string") {
      const matches = definition.match(dependencyRegex);
      // hey dependency builder, i want you to inject this dependency when you get the chance.
    }
    return definition;
  }

  findDependencies(definition: any): any {
    if (Array.isArray(definition)) {
      // find dependencies in array
      return definition.map((item) => this.findDependencies(item));
    } else if (definition instanceof Object) {
      // find dependencies in object
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
