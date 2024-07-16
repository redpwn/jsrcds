// @ts-ignore since there is no type definition for js-hcl-parser
import hcl from "@cdktf/hcl2json";
import path from "path";
import { glob } from "glob";

import fs from "fs";

import { Loader } from "..";
import { Resource } from "./resource";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

/**
 * A config specifying how ResourceFileLoader should parse its challenge configs
 */
export interface ResourceFileLoaderConfig {
  loaderType: "resource";
  /**
   * A path to the root directory containing all challenge configurations
   */
  repoRoot: string;
}

/**
 * Implementation of Loader interface for parsing HCL challenge configs
 */
export class ResourceFileLoader extends Loader<ResourceFileLoaderConfig> {
  /**
   * Parses HCL challenge configuration files and returns the parsed output
   *
   * @returns An array promise, whose elements are an array of Resource objects
   * specifying the resource blocks in each config
   */
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

  /**
<<<<<<< HEAD
   * Loads a specific resource specified in the config file and returns the output
   * @remarks
   * challenge.hcl may contain an object holding the file path to the flag itself, rather
   * than a string field for the flag. `getResource` serves to handle these cases
   *
   * @param segment - A path to a directory containing the resource
   * @param path - A path relative to segment that points directly to the resource
   * @returns The parsed resource
=======
   * {@inheritDoc Loader.getResource)
>>>>>>> 30a4fc615eca75b86b011b5f2478960ffda1a00a
   */
  async getResource(segment: string, filePath: string): Promise<string> {
    return fs.promises.readFile(
      path.join(this.config.repoRoot, segment, filePath),
      "utf8"
    );
  }
}
