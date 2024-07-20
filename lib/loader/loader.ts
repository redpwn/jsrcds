// TODO: document
export type ExtractLoaderConfig<T> = T extends Loader<infer U> ? U : never;

export interface LoaderConfig<T = string> {
  loaderType: T;
  [key: string]: any;
}

/**
 * A loader which generates a list of ChallengeConfig, which can then be validated and hydrated
 *
 * @typeParam LoaderConfig - Type of config that Loader should use when loading challenges
 *
 * @remarks
 * we may want this class to do other things in the future
 */
export abstract class Loader<Config extends LoaderConfig> {
  constructor(public config: Config) {}

  /**
   * Parses challenge configuration files and returns the parsed output
   * @returns An array promise, whose elements are the parsed challenge configuration files
   */
  abstract getChallenges(): Promise<any[]>;

  /**
   * Loads a specific resource specified in the challenge config
   * @remarks
   * challenge.yml may contain an object holding the file path to the flag itself, rather
   * than a string field for the flag. `getResource` serves to handle these cases
   *
   * @param segment - A path to a directory containing the resource
   * @param path - A path relative to `segment` that points directly to the resource
   * @returns A string promise of the parsed resource
   */
  abstract getResource(segment: string, path: string): Promise<string>;
}
