export abstract class Plugin {
  public abstract readonly key: string;

  public abstract getChallengeConfigSchema(): any;
}
