import { Loader } from "rcds/loader";

import { type FileStorage } from "@rcds/resource-fs";
import { Containers } from "@rcds/plugin-containers";

import { parse } from "yaml";

import { createChallengeConfigSchema, type ChallengeConfig } from "./schema";

interface ClassicLoaderConfig {}

export class ClassicLoader extends Loader<ClassicLoaderConfig> {
  constructor(
    config: ClassicLoaderConfig,
    private fs: FileStorage,
    private containers: Containers
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
      challengeList.map(async (globPath) => {
        const rawConfig = await this.getChallengeConfig(globPath);
        const config = this.validateChallengeConfig(rawConfig);

        return () => {
          Object.entries(config.containers).map(
            async ([name, containerConfig]) => {
              const hash = this.containers.buildImage(name, "newo");
            }
          );

          // this.runtime.deployChallenge({
          //   name: config.id,
          // });
          // const urls = this.bucket.uploadFiles({
          //   // ...
          // });
          // this.scoreboard.pushChallenge({
          //   // ...
          // });
        };
      })
    );
  }

  validateChallengeConfig(config: any): ChallengeConfig {
    return createChallengeConfigSchema().parse(config);
  }

  async getChallengeConfig(path: string): Promise<any> {
    const challengeYaml = await this.fs.readFile(path);
    return parse(challengeYaml);
  }
}
