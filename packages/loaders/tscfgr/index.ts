import { Loader } from "rcds/src/loader";
import { registry } from "rcds/src/registry";

import path from "path";
import fs from "fs";
import { glob } from "glob";
// import { tsImport } from "tsx/esm/api";

interface TSRawFileLoaderConfig {
  repoRoot: string;
}

// @registry([{ token: "TSRawFileLoader", useValue: TSRawFileLoader }])
export class TSRawFileLoader extends Loader<TSRawFileLoaderConfig> {
  async getChallenges() {
    const challengeList = await glob("**/challenge.raw.config.?(m)ts", {
      absolute: true,
      cwd: this.config.repoRoot,
    });

    return async () =>
      Promise.all(
        challengeList.map(async (globPath) => {
          console.log(`running ${globPath}`);
          const tsFile = await import(globPath);
        })
      );
  }

  // FIXME: typedoc failing to find Loader.getResource for @inheritDoc but not for @link
  /**
   * {@inheritDoc Loader.getResource}
   */
  async getResource(segment: string, filePath: string): Promise<string> {
    return fs.promises.readFile(
      path.join(this.config.repoRoot, segment, filePath),
      "utf8"
    );
  }
}
