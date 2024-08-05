import { Loader } from "rcds/loader";
import { parse } from "yaml";

import { type FileStorage } from "@rcds/plugin-fs";

interface ClassicLoaderConfig {}

export class ClassicLoader extends Loader<ClassicLoaderConfig> {
  constructor(config: ClassicLoaderConfig, private fs: FileStorage) {
    super(config);
  }

  async getChallenges() {
    const challengeList = await this.fs.glob("**/challenge.y?(a)ml");

    console.log("challenge list", challengeList);
    const challengeFns = await Promise.all(
      challengeList.map(async (globPath) => {
        console.log("path", globPath);
        const challengeYaml = await this.fs.readFile(globPath);
        const challenge = parse(challengeYaml);
      })
    );
  }
}
