import { Loader } from "@rcds/loader";
import { registry } from "tsyringe";

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
      cwd: this.config.repoRoot,
    });

    const prog = async () =>
      Promise.all(
        challengeList.map(async (globPath) => {
          const configPath = path.join(this.config.repoRoot, globPath);

          const segment = path.dirname(globPath).replaceAll(path.sep, "/");
          if (!/^[a-z0-9/-]+$/.test(segment)) {
            throw new Error(`invalid challenge segment name: ${segment}`);
          }

          console.log(`running ${configPath}`);
          const tsFile = await tsImport(configPath, import.meta.url);
        })
      );
    return prog;
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
