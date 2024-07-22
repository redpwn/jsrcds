import { Loader } from "@rcds/loader";
import { registry } from "@rcds/registry";

// config the user provides. like for example repoRoot, apiEndpoint, etc.
interface ExampleLoaderConfig {}

// use this registry decorator so rCDS knows the loader exists!
@registry([{ token: "ExampleLoader", useValue: ExampleLoader }])

// extend the loader class with your own config and implementation
export class ExampleLoader extends Loader<ExampleLoaderConfig> {
  // dummy list of challenges
  async getChallenges() {
    return [];
  }
}
