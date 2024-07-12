import path from "path";
import fs from "fs";
import { loadYaml } from "../util";
import { type IChallengeConfig, ChallengeConfig } from "../schemas";

export class Challenge {
  // path to challenge.yml
  configPath: string;
  // challenge dir in repo (category/name)
  segment: string;
  // full path to challenge dir
  dir: string;

  constructor(repoRoot: string, globPath: string) {
    this.configPath = path.join(repoRoot, globPath);
    this.dir = path.dirname(this.configPath);
    this.segment = path.dirname(globPath).replaceAll(path.sep, "/");

    if (!/^[a-z0-9/-]+$/.test(this.segment)) {
      throw new Error(`invalid challenge segment: ${this.segment}`);
    }
  }

  async readConfigFile() {
    const config = ChallengeConfig.safeParse(await loadYaml(this.configPath));
    if (!config.success) {
      const error = config.error.format();
      throw new Error(
        `invalid config: ${this.segment}: ${config.error.message}`
      );
    }
  }
}
