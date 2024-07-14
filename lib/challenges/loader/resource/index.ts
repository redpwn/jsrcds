import path from "path";
import { glob } from "glob";

import fs from "fs";

import { Loader } from "..";

export interface ClassicFileLoaderConfig {
  repoRoot: string;
}

export class ResourceFileLoader extends Loader<ClassicFileLoaderConfig> {
  async getChallenges(): Promise<any[]> {
    const challengeList = await glob("**/challenge.y?(a)ml", {
      cwd: this.config.repoRoot,
    });

    return Promise.all(
      challengeList.map(async (globPath) => {
        const configPath = path.join(this.config.repoRoot, globPath);

        const segment = path.dirname(globPath).replaceAll(path.sep, "/");
        if (!/^[a-z0-9/-]+$/.test(segment)) {
          throw new Error(`invalid challenge segment name: ${segment}`);
        }
      })
    );
  }

  async getResource(segment: string, filePath: string): Promise<string> {
    return fs.promises.readFile(
      path.join(this.config.repoRoot, segment, filePath),
      "utf8"
    );
  }
}
