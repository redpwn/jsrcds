import { Loader } from "rcds/loader";
import { parse } from "yaml";

import { createChallengeConfigSchema, type ChallengeConfig } from "./schema";
import { Challenge } from "./challenge";

import { type FileStorage } from "@rcds/resource-fs";

interface ClassicLoaderConfig {}

export class ClassicLoader extends Loader<ClassicLoaderConfig> {
  constructor(config: ClassicLoaderConfig, private fs: FileStorage) {
    super(config);
  }

  validateChallengeConfig(config: any): ChallengeConfig {
    return createChallengeConfigSchema().parse(config);
  }

  async getChallengeConfig(path: string): Promise<any> {
    const challengeYaml = await this.fs.readFile(path);
    return parse(challengeYaml);
  }

  async getChallengeList(): Promise<string[]> {
    return this.fs.glob("**/challenge.y?(a)ml");
  }

  async getChallenges() {
    const challengeList = await this.getChallengeList();
    console.log("challenge list", challengeList);

    const challengeFns = await Promise.all(
      challengeList.map(async (globPath) => {
        const rawConfig = await this.getChallengeConfig(globPath);
        const config = this.validateChallengeConfig(rawConfig);
        const challenge = new Challenge(config);

        console.log("challenge", config);
      })
    );
  }
}
