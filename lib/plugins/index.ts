export abstract class ResourceBlockConfig<Schema> {
  public abstract key: string;
  public abstract schema: Zod.Schema<Schema>;
}

export abstract class Plugin {
  public abstract readonly name: string;

  public abstract getChallengeConfigSchema(): any;
}
