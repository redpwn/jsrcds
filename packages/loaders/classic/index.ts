import { Loader } from "rcds/loader";

import { FileStorage } from "@rcds/resource-fs";
import { Challenge } from "@rcds/plugin-challenge";

import { parse } from "yaml";
import path from "path";

import { createChallengeConfigSchema, type ChallengeConfig } from "./schema";

interface ClassicLoaderConfig {}

export class ClassicLoader extends Loader<ClassicLoaderConfig> {
  constructor(
    config: ClassicLoaderConfig,
    private fs: FileStorage,
    private challenge: Challenge
  ) {
    super(config);
  }

  async getChallengeList(): Promise<string[]> {
    return this.fs.glob("**/challenge.y?(a)ml");
  }

  async getChallenges() {
    const challengeList = await this.getChallengeList();
    console.log("challenge list", challengeList);

    return await Promise.all(
      challengeList.map(async (globPath) => this.getChallenge(globPath))
    );
  }

  async getChallenge(globPath: string) {
    const challengeDirectory = path.dirname(globPath);
    const config = await this.getChallengeConfig(globPath);

    return () => {
      const containers = Object.entries(config.containers).map(
        ([name, containerConfig]) => ({
          name,
          ...containerConfig,
        })
      );

      this.challenge.createChallenge({
        name: config.name,
        containers: containers,
      });
    };
  }

  validateChallengeConfig(config: any): ChallengeConfig {
    return createChallengeConfigSchema(this.fs).parse(config);
  }

  async parseChallengeConfig(path: string): Promise<any> {
    const challengeYaml = await this.fs.readFile(path);
    return parse(challengeYaml);
  }

  async getChallengeConfig(path: string): Promise<ChallengeConfig> {
    const rawConfig = await this.parseChallengeConfig(path);
    return this.validateChallengeConfig(rawConfig);
  }
}
