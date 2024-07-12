import path from "path";
import { glob } from "glob";

import { loadYaml } from "../../util";
import { type ChallengeConfig } from "../../schemas";
import type { Loader } from ".";

export interface RepoLoaderConfig {
  repoRoot: string;
}

export class RepoLoader implements Loader<RepoLoaderConfig> {
  async getChallenges({
    repoRoot,
  }: RepoLoaderConfig): Promise<ChallengeConfig[]> {
    const challengeList = await glob("**/challenge.y?(a)ml", {
      cwd: repoRoot,
    });

    return Promise.all(
      challengeList.map(async (globPath) => {
        const configPath = path.join(repoRoot, globPath);
        const config: ChallengeConfig = await loadYaml(configPath);

        config.segment = path.dirname(globPath).replaceAll(path.sep, "/");
        if (!/^[a-z0-9/-]+$/.test(config.segment)) {
          throw new Error(`invalid challenge segment: ${config.segment}`);
        }

        return config;
      })
    );
  }
}
