import { Loader } from "@rcds/loader";
import { registry } from "@rcds/registry";

import path from "path";
import fs from "fs";
import { glob } from "glob";
import { tsImport } from "tsx/esm/api";

interface TSFileLoaderConfig {
  repoRoot: string;
}

@registry([{ token: "TSFileLoader", useValue: TSFileLoader }])
export class TSFileLoader extends Loader<TSFileLoaderConfig> {
  async getChallenges() {
    const challengeList = await glob("**/challenge.config.?(m)ts", {
      absolute: true,
      cwd: this.config.repoRoot,
    });

    return async () =>
      Promise.all(
        challengeList.map(async (globPath) => {
          console.log(`running ${globPath}`);
          const tsFile = await tsImport(globPath, import.meta.url);
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
