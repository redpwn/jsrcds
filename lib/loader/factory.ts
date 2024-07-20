import { Loader, type LoaderConfig } from ".";
import { LOADERS } from "@rcds/packages";

// type y = (typeof LOADERS)[0];
// type x<T> = typeof T extends Loader<infer U> ? U : never;
// type z = x<typeof TSFileLoader | Loader<LoaderConfig<"meow2">>>;

// TODO: fix ts types for loader factory
export class LoaderFactory extends Loader<LoaderConfig> {
  private loader: Loader<LoaderConfig>;

  constructor(config: LoaderConfig) {
    super(config);

    const SelectedLoader = LOADERS.find(
      (loader) => loader.name === config.loaderType
    );
    if (!SelectedLoader) {
      throw new Error(`Loader of type "${config.loaderType}" not found`);
    }
    this.loader = new SelectedLoader(config as any);
  }

  public getChallenges(): Promise<any[]> {
    return this.loader.getChallenges();
  }

  public getResource(segment: string, filePath: string): Promise<string> {
    return this.loader.getResource(segment, filePath);
  }
}
