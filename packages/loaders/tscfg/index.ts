import { Loader } from "rcds/loader";

import { glob } from "glob";
import { compile } from "./compile";

interface TSFileLoaderConfig {
  repoRoot: string;
  model: Record<string, any>;
}

// @registry([{ token: "TSRawFileLoader", useValue: TSRawFileLoader }])
export class TSFileLoader extends Loader<TSFileLoaderConfig> {
  async getChallenges() {
    const challengeList = await glob("**/challenge.config.?(m)ts", {
      absolute: true,
      cwd: this.config.repoRoot,
    });

    console.log("challenge list", challengeList);

    const challengeFns = await Promise.all(
      challengeList.map(async (globPath) => {
        const sourceFile = await compile(globPath);
        console.log("source file", sourceFile);
      })
    );
  }
}
