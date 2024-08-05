import { Loader } from "rcds/loader";

import { glob } from "glob";

interface ClassicFileLoaderConfig {
  repoRoot: string;
}

// @registry([{ token: "TSRawFileLoader", useValue: TSRawFileLoader }])
export class ClassicFileLoader extends Loader<ClassicFileLoaderConfig> {
  async getChallenges() {
    const challengeList = await glob("**/challenge.y?(a)ml", {
      absolute: true,
      cwd: this.config.repoRoot,
    });

    console.log("challenge list", challengeList);
    const challengeFns = await Promise.all(
      challengeList.map(async (globPath) => {
        console.log("path", globPath);
      })
    );
  }
}
