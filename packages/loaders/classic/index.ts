import { Loader } from "rcds/loader";

import type { FileStorage } from "@rcds/resource-fs";
import { ChallengePlugin } from "@rcds/plugin-challenge";

import { parse } from "yaml";

import { createChallengeConfigSchema, type ChallengeConfig } from "./schema";
import { Challenge } from "./challenge";

interface ClassicLoaderConfig {}

export class ClassicLoader extends Loader<ClassicLoaderConfig> {
  constructor(
    config: ClassicLoaderConfig,
    private fs: FileStorage,
    private challengePlugin: ChallengePlugin
  ) {
    super(config);
  }

  async getChallenges() {
    const challengeList = await this.getChallengeList();

    return await Promise.all(
      challengeList.map(async (globPath) => this.getChallenge(globPath))
    );
  }

  async getChallengeList(): Promise<string[]> {
    return this.fs.glob("**/challenge.y?(a)ml");
  }

  async getChallenge(globPath: string) {
    // const challengeDirectory = path.dirname(globPath);
    const config = await this.getChallengeConfig(globPath);
    return () => new Challenge(config, this.challengePlugin);
  }

  async getChallengeConfig(path: string): Promise<ChallengeConfig> {
    const rawConfig = await this.parseChallengeConfig(path);
    return this.validateChallengeConfig(rawConfig);
  }

  validateChallengeConfig(config: any): ChallengeConfig {
    return createChallengeConfigSchema(this.fs).parse(config);
  }

  async parseChallengeConfig(path: string): Promise<any> {
    const challengeYaml = await this.fs.readFile(path);
    return parse(challengeYaml);
  }
}
