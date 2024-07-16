import type { ClassicFileLoaderConfig } from "./classic";
import type { ResourceFileLoaderConfig } from "./resource";

// a challenge loader generates a list of ChallengeConfig, which can then be validated and hydrated
// we may want this class to do other things in the future
export abstract class Loader<LoaderConfig> {
  constructor(public config: LoaderConfig) {}

  abstract getChallenges(): Promise<any[]>;
  abstract getResource(segment: string, path: string): Promise<string>;
}

export type LoaderConfig = ClassicFileLoaderConfig | ResourceFileLoaderConfig;
