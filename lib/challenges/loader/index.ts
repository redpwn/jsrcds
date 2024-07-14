import type { ChallengeConfig } from "../schema";
import type { ClassicFileLoaderConfig } from "./classic";

// a challenge loader generates a list of ChallengeConfig, which can then be validated and hydrated
// we may want this class to do other things in the future
export abstract class Loader<LoaderConfig> {
  config: LoaderConfig;

  constructor(config: LoaderConfig) {
    this.config = config;
  }

  abstract getChallenges(): Promise<ChallengeConfig[]>;
  abstract getResource(segment: string, path: string): Promise<string>;
}

export type LoaderConfig = ClassicFileLoaderConfig;
