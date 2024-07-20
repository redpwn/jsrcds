import path from "path";
import { glob } from "glob";
import fs from "fs";

import { Loader, type LoaderConfig } from "../../../lib/loader";
import { tsImport } from "tsx/esm/api";
interface TSFileLoaderConfig extends LoaderConfig<"tscfg"> {
  repoRoot: string;
}

export default class TSFileLoader extends Loader<TSFileLoaderConfig> {
  async getChallenges(): Promise<any[]> {
    const challengeList = await glob("**/challenge.config.?(m)ts", {
      cwd: this.config.repoRoot,
    });

    return await Promise.all(
      challengeList.map(async (globPath) => {
        const configPath = path.join(this.config.repoRoot, globPath);

        const segment = path.dirname(globPath).replaceAll(path.sep, "/");
        if (!/^[a-z0-9/-]+$/.test(segment)) {
          throw new Error(`invalid challenge segment name: ${segment}`);
        }

        console.log(configPath);
        const tsFile = await tsImport(configPath, import.meta.url);
        console.log(tsFile);
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
