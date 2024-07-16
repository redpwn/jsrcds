// @ts-ignore since there is no type definition for js-hcl-parser
import hcl from "@cdktf/hcl2json";
import path from "path";
import { glob } from "glob";

import fs from "fs";

import { Loader } from "..";
import { Resource } from "./resource";

export interface ResourceFileLoaderConfig {
  repoRoot: string;
}

export class ResourceFileLoader extends Loader<ResourceFileLoaderConfig> {
  async getChallenges(): Promise<any[]> {
    const challengeList = await glob("**/challenge.hcl", {
      cwd: this.config.repoRoot,
    });

    return await Promise.all(
      challengeList.map(async (globPath) => {
        const configPath = path.join(this.config.repoRoot, globPath);

        const segment = path.dirname(globPath).replaceAll(path.sep, "/");
        if (!/^[a-z0-9/-]+$/.test(segment)) {
          throw new Error(`invalid challenge segment name: ${segment}`);
        }

        const hclString = (await fs.promises.readFile(configPath)).toString();
        const resources = await hcl.parse(configPath, hclString);
        const resourceList = [];
        for (const resource in resources) {
          resourceList.push(new Resource(resource, resources[resource]));
        }
        return resourceList;
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
