import path from "path";
import { glob } from "glob";

import { loadYaml } from "../../../util";
import {
  type ChallengeConfig,
  createChallengeConfigSchema,
} from "../../schema";

import fs from "fs";

import { Loader } from "..";

export interface ClassicFileLoaderConfig {
  repoRoot: string;
}

export class ClassicFileLoader extends Loader<ClassicFileLoaderConfig> {
  async getChallenges(): Promise<ChallengeConfig[]> {
    const challengeList = await glob("**/challenge.y?(a)ml", {
      cwd: this.config.repoRoot,
    });

    return Promise.all(
      challengeList.map(async (globPath) => {
        const configPath = path.join(this.config.repoRoot, globPath);
        const config = await loadYaml(configPath);

        const segment = path.dirname(globPath).replaceAll(path.sep, "/");
        if (!/^[a-z0-9/-]+$/.test(segment)) {
          throw new Error(`invalid challenge segment name: ${segment}`);
        }

        const schema = createChallengeConfigSchema(this, segment);

        return schema.parseAsync(config); // TODO: use safeParseAsync and handle errors properly
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
