/**
 * A loader which generates a list of Challenges, which can then be validated and hydrated
 *
 * @typeParam LoaderConfig - Type of config that Loader should use when loading challenges
 *
 * @remarks
 * we may want this class to do other things in the future
 */
export abstract class Loader<T> {
  constructor(protected config: T) {}

  /**
   * Parses challenge configuration files and returns the parsed output
   * @returns An array promise, whose elements are the parsed challenge configuration files
   */
  abstract getChallenges(): Promise<any>;
}

type Challenge = any;
