import { Loader } from "@rcds/loader";
import { registry } from "tsyringe";

interface ExampleLoaderConfig {
  repoRoot: string;
}

@registry([{ token: "ExampleLoader", useValue: ExampleLoader }])
export class ExampleLoader extends Loader<ExampleLoaderConfig> {
  async getChallenges() {
    return [];
  }
}
