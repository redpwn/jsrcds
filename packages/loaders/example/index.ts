import { Loader } from "@rcds/loader";
import { registry } from "@rcds/registry";

interface ExampleLoaderConfig {}

@registry([{ token: "ExampleLoader", useValue: ExampleLoader }])
export class ExampleLoader extends Loader<ExampleLoaderConfig> {
  async getChallenges() {
    return [];
  }
}
