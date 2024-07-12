import type { ChallengeConfig } from "../../schemas";
import type { RepoLoaderConfig } from "./repo";

// a challenge loader generates a list of ChallengeConfig, which can then be validated and hydrated
// we may want this class to do other things in the future
export abstract class Loader<LoaderConfig> {
  abstract getChallenges(config: LoaderConfig): Promise<ChallengeConfig[]>;
}

export type LoaderConfig = RepoLoaderConfig;
