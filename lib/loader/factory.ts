import { PackageManager } from "@rcds/package";
import { Loader, type LoaderConfig } from ".";

const loaders = await PackageManager.getPackageManager().getLoaders();

class LoaderFactory extends Loader<LoaderConfig> {
  private loader: Loader<LoaderConfig>;

  constructor(config: LoaderConfig) {
    super(config);

    const loader = loaders.find((loader) => );
    if (!loader) {
      throw new Error(`Loader of type "${config.loaderType}" not found`);
    }
    this.loader = loader;
  }

  public getChallenges(): Promise<any[]> {
    return this.loader.getChallenges();
  }

  public getResource(segment: string, filePath: string): Promise<string> {
    return this.loader.getResource(segment, filePath);
  }
}
