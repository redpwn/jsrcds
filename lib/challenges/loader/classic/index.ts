import path from "path";
import { glob } from "glob";

import { loadYaml } from "../../../util";
import { type ChallengeConfig, createChallengeConfigSchema } from "./schema";

import fs from "fs";

import { Loader } from "..";

/**
 * A config specifying how ClassicFileLoader should parse its challenge configs
 */
export interface ClassicFileLoaderConfig {
  /**
   * A path to the root directory containing all challenge configurations
   */
  repoRoot: string;
}

/**
 * Implementation of Loader interface for parsing YAML challenge configs
 */
export class ClassicFileLoader extends Loader<ClassicFileLoaderConfig> {
  /**
   * Validates YAML challenge configuration files and returns the parsed output
   * 
   * @returns An array promise, whose elements are objects
   * representing the parsed challenge config
   * 
   * @throws ZodError
   * Thrown if config file is invalid
   */
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

  /**
   * {@inheritDoc Loader.getResource)
   */
  async getResource(segment: string, filePath: string): Promise<string> {
    return fs.promises.readFile(
      path.join(this.config.repoRoot, segment, filePath),
      "utf8"
    );
  }
}
